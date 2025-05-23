import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL;

const BookingPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [rescheduleError, setRescheduleError] = useState("");
  const [hoveredBookingId, setHoveredBookingId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaint, setComplaint] = useState("");
  const [newFavoriteEmployee, setNewFavoriteEmployee] = useState("");
  const [manPower, setManPower] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [parlorTimings, setParlorTimings] = useState({
    fromTime: "",
    toTime: "",
  });

  // Helper to fetch bookings
  const fetchBookings = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      alert("Please log in to view bookings.");
      return [];
    }
    try {
      const res = await axios.get(
        `${BASE_URL}/api/users/customer/bookings/${email}`
      );
      const users = res.data;
      const allBookings = users.flatMap((user) =>
        user.bookings.map((booking) => ({
          _id: booking._id,
          transactionId: booking.transactionId,
          customerName: booking.name,
          serviceName: booking.service,
          bookingDate: booking.date,
          bookingTime: booking.time,
          status: booking.paymentStatus,
          parlorName: booking.parlorName,
          parlorEmail: booking.parlorEmail || "",
          totalAmount: booking.total_amount,
          PaidAmount: booking.amount,
          RemainingAmount: booking.total_amount - booking.amount,
          paymentMode: booking.Payment_Mode,
          relatedServices: booking.relatedServices?.join(", "),
          bookingId: booking.bookingId || booking._id,
          rating: booking.userRating || null,
          comment: booking.userReview || null,
          orderId: booking.orderId,
          pin: booking.pin,
          complaint: booking.userComplaint || null,
          confirmed: booking.confirmed,
          refundedAmount: booking.refundedAmount || 0,
          upiId: booking.upiId || null,
          refundStatus: booking.refundStatus || "NONE",
          favoriteEmployee: booking.favoriteEmployee || "",
          duration: booking.duration || 60,
        }))
      );
      setBookings(allBookings);
      setFilteredBookings(allBookings.reverse());
      return allBookings;
    } catch (error) {
      alert("Failed to fetch bookings. Please try again.");
      return [];
    }
  };

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on status
  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter(
          (booking) =>
            booking.status?.toLowerCase() === filterStatus.toLowerCase()
        )
      );
    }
  }, [filterStatus, bookings]);

  // Handle click outside for mobile popups
  useEffect(() => {
    if (!isMobile || !hoveredBookingId) return;

    const handleClickOutside = (event) => {
      const ratingContainer = document.querySelector(
        `.rating-container[data-booking-id="${hoveredBookingId}"]`
      );
      const commentPopup = document.querySelector(
        `.comment-popup[data-booking-id="${hoveredBookingId}"]`
      );
      const complaintContainer = document.querySelector(
        `.complaint-container[data-booking-id="${hoveredBookingId}"]`
      );
      const complaintPopup = document.querySelector(
        `.complaint-popup[data-booking-id="${hoveredBookingId}"]`
      );

      if (
        !ratingContainer?.contains(event.target) &&
        !commentPopup?.contains(event.target) &&
        !complaintContainer?.contains(event.target) &&
        !complaintPopup?.contains(event.target)
      ) {
        setHoveredBookingId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, hoveredBookingId]);

  // Fetch manpower and parlor timings for reschedule modal
  useEffect(() => {
    if (isRescheduleModalOpen && selectedBookingId) {
      const selectedBooking = bookings.find((b) => b._id === selectedBookingId);
      if (selectedBooking?.parlorEmail) {
        fetchManPower(selectedBooking.parlorEmail);
        fetchParlorTimings(selectedBooking.parlorEmail);
        setNewFavoriteEmployee(selectedBooking.favoriteEmployee || "");
      }
    }
  }, [isRescheduleModalOpen, selectedBookingId]);

  const fetchParlorEmail = async (parlorName) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/parlor-by-name`, {
        params: { name: parlorName },
      });
      return response.data.email;
    } catch (error) {
      return "";
    }
  };

  const fetchParlorTimings = async (parlorEmail) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/parlor/${parlorEmail}`
      );
      const { fromTime, toTime } = response.data.availableTime || {};
      if (fromTime && toTime) {
        setParlorTimings({ fromTime, toTime });
      } else {
        setRescheduleError("Parlor timings not available.");
        setAvailableSlots([]);
      }
    } catch (error) {
      setRescheduleError("Failed to fetch parlor timings.");
      setAvailableSlots([]);
    }
  };

  const fetchManPower = async (parlorEmail) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/get-manpower/${parlorEmail}`
      );
      setManPower(response.data);
    } catch (error) {
      setManPower([]);
    }
  };

  const handlePayRemaining = async (booking) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    try {
      const userEmail = localStorage.getItem("email");
      if (!userEmail) {
        alert("User email not found. Please log in again.");
        return;
      }

      const bookingData = {
        userEmail,
        bookingId: booking._id,
        amount: booking.RemainingAmount,
      };

      const response = await axios.post(
        `${BASE_URL}/api/razorpay/remaining-order`,
        bookingData
      );
      const { order, bookingId } = response.data;

      if (!order || !bookingId) {
        throw new Error("Failed to create order");
      }

      const options = {
        key: "rzp_test_UlCC6Rw2IJrhyh",
        amount: order.amount,
        currency: order.currency,
        name: "Parlor Booking",
        description: `Remaining payment for booking ${bookingId}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const validationResponse = await axios.post(
              `${BASE_URL}/api/razorpay/order/validate`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userEmail,
                bookingId,
                pin: booking.pin || "0000",
                paymentType: "remaining", // Added paymentType
              }
            );

            // Refetch bookings to ensure UI reflects database state
            const updatedBookings = await fetchBookings();

            // Update state immediately for smooth UX
            setBookings(
              updatedBookings.map((b) =>
                b._id === booking._id
                  ? {
                      ...b,
                      PaidAmount: b.totalAmount,
                      RemainingAmount: 0,
                      transactionId: response.razorpay_payment_id,
                      paymentStatus: "PAID",
                    }
                  : b
              )
            );

            alert("Remaining payment successful!");
            navigate(
              `/payment/callback?order_id=${response.razorpay_order_id}`,
              {
                state: {
                  parlor: {
                    name: booking.parlorName,
                    email: booking.parlorEmail,
                  },
                  totalAmount: booking.totalAmount,
                  service: booking.serviceName,
                  name: booking.customerName,
                  date: booking.bookingDate,
                  time: booking.bookingTime,
                  bookingId,
                  paymentStatus: "PAID",
                  transactionId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  currency: order.currency,
                  amount: booking.RemainingAmount,
                  total_amount: booking.totalAmount,
                  createdAt: new Date().toISOString(),
                },
              }
            );
          } catch (err) {
            alert(
              `Payment verification failed: ${
                err.response?.data?.error || err.message
              }`
            );
          }
        },
        prefill: {
          name: booking.customerName,
          email: userEmail,
          contact: "9234567890",
        },
        notes: { bookingId, userEmail, paymentType: "remaining" },
        theme: { color: "#4a3f8c" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async function (response) {
        const failureReason = response.error.description || "Payment failed";
        alert(`Payment failed: ${failureReason}`);
        navigate(
          `/payment/callback?order_id=${response.error.metadata.order_id}`,
          {
            state: {
              parlor: { name: booking.parlorName, email: booking.parlorEmail },
              totalAmount: booking.totalAmount,
              service: booking.serviceName,
              name: booking.customerName,
              date: booking.bookingDate,
              time: booking.bookingTime,
              bookingId,
              paymentStatus: "FAILED",
              transactionId: response.error.metadata.payment_id,
              orderId: response.error.metadata.order_id,
              failureReason,
              currency: order.currency,
              amount: booking.RemainingAmount,
              total_amount: booking.totalAmount,
              createdAt: new Date().toISOString(),
            },
          }
        );
      });
      rzp.open();
    } catch (err) {
      alert(
        `Error processing payment: ${err.response?.data?.error || err.message}`
      );
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "#0e0f0f";
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "completed" || lowerStatus === "paid") return "#201548";
    if (lowerStatus === "pending") return "#FFC107";
    if (lowerStatus === "cancelled") return "#F44336";
    return "#0e0f0f";
  };

  const getRefundStatusColor = (refundStatus) => {
    if (!refundStatus) return "#0e0f0f";
    const lowerStatus = refundStatus.toLowerCase();
    if (lowerStatus === "pending") return "#FFC107";
    if (lowerStatus === "approved") return "#201548";
    if (lowerStatus === "rejected") return "#F44336";
    if (lowerStatus === "none") return "#0e0f0f";
    return "#0e0f0f";
  };

  const isFutureDate = (bookingDate) => {
    if (!bookingDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const booking = new Date(bookingDate);
    booking.setHours(0, 0, 0, 0);
    return booking >= today;
  };

  const isPastDate = (bookingDate) => {
    if (!bookingDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const booking = new Date(bookingDate);
    booking.setHours(0, 0, 0, 0);
    return booking < today;
  };

  const openModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setRating(0);
    setComment("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
    setRating(0);
    setComment("");
  };

  const openCancelModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setUpiId("");
    setUpiError("");
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedBookingId(null);
    setUpiId("");
    setUpiError("");
  };

  const openRescheduleModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    const selectedBooking = bookings.find((b) => b._id === bookingId);
    const duration = selectedBooking
      ? 60 + (selectedBooking.relatedServices?.split(", ").length - 1) * 30
      : 60;
    setNewDate(selectedBooking?.bookingDate.split("T")[0] || "");
    setNewTime("");
    setAvailableSlots([]);
    setRescheduleError("");
    setNewFavoriteEmployee(selectedBooking?.favoriteEmployee || "");
    setIsRescheduleModalOpen(true);
    if (selectedBooking?.bookingDate && selectedBooking?.parlorEmail) {
      fetchAvailableSlots(
        bookingId,
        selectedBooking.bookingDate.split("T")[0],
        selectedBooking.favoriteEmployee,
        duration
      );
    }
  };

  const closeRescheduleModal = () => {
    setIsRescheduleModalOpen(false);
    setSelectedBookingId(null);
    setNewDate("");
    setNewTime("");
    setAvailableSlots([]);
    setRescheduleError("");
    setNewFavoriteEmployee("");
  };

  const openComplaintModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setComplaint("");
    setIsComplaintModalOpen(true);
  };

  const closeComplaintModal = () => {
    setIsComplaintModalOpen(false);
    setSelectedBookingId(null);
    setComplaint("");
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === "modal") {
      closeModal();
      closeComplaintModal();
      closeCancelModal();
      closeRescheduleModal();
    }
  };

  const handleRating = (star) => {
    setRating(star);
  };

  const validateUpiId = (upi) => {
    const upiRegex = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/;
    return upiRegex.test(upi);
  };

  const parseTimeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period && period.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (period && period.toLowerCase() === "am" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const generateTimeSlots = (startTime, endTime, interval = 60) => {
    const slots = [];
    const start = parseTime(startTime);
    const end = parseTime(endTime);

    for (let time = start; time < end; time += interval) {
      const slotStart = formatTime(time);
      const slotEnd = formatTime(time + interval);
      slots.push(`${slotStart}-${slotEnd}`);
    }
    return slots;
  };

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isSlotAvailable = (slot, duration, bookedSlots) => {
    const slotStart = timeToMinutes(slot.split("-")[0]);
    const slotEnd = slotStart + duration;

    for (const booked of bookedSlots) {
      const bookedStart = timeToMinutes(booked.time.split("-")[0]);
      const bookedEnd = bookedStart + (booked.duration || 60);

      if (!(slotEnd <= bookedStart || slotStart >= bookedEnd)) {
        return false;
      }
    }

    const today = new Date();
    const selectedDate = new Date(newDate);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (today.getTime() === selectedDate.getTime()) {
      const currentTime = new Date();
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
      return slotStart > currentTimeInMinutes;
    }
    return true;
  };

  const isPastSlot = (slot) => {
    const today = new Date();
    const selectedDate = new Date(newDate);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (today.getTime() === selectedDate.getTime()) {
      const currentTime = new Date();
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
      const slotStart = timeToMinutes(slot.split("-")[0]);
      return slotStart <= currentTimeInMinutes;
    }
    return false;
  };

  const fetchBookedSlots = async (employeeName, date) => {
    const email = localStorage.getItem("email");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/users/customer/bookings/${email}`
      );
      const filteredBookings = response.data
        .flatMap((user) => user.bookings)
        .filter(
          (booking) =>
            booking.favoriteEmployee === employeeName &&
            booking.date &&
            typeof booking.date === "string" &&
            booking.date.split("T")[0] === date
        )
        .map((booking) => ({
          time: booking.time,
          duration: booking.duration || 60,
        }));
      setBookedSlots(filteredBookings);
    } catch (error) {
      setBookedSlots([]);
    }
  };

  const fetchAvailableSlots = async (
    bookingId,
    date,
    favoriteEmployee,
    duration
  ) => {
    const selectedBooking = bookings.find((b) => b._id === bookingId);
    if (!selectedBooking) {
      setRescheduleError("Booking not found.");
      setAvailableSlots([]);
      return;
    }

    if (!date || !favoriteEmployee) {
      setAvailableSlots([]);
      return;
    }

    let parlorEmail = selectedBooking.parlorEmail;
    if (!parlorEmail) {
      parlorEmail = await fetchParlorEmail(selectedBooking.parlorName);
      if (!parlorEmail) {
        setRescheduleError("Unable to fetch parlor information.");
        setAvailableSlots([]);
        return;
      }
    }

    try {
      if (!parlorTimings.fromTime || !parlorTimings.toTime) {
        await fetchParlorTimings(parlorEmail);
      }

      const slots = generateTimeSlots(
        parlorTimings.fromTime,
        parlorTimings.toTime,
        60
      );

      await fetchBookedSlots(favoriteEmployee, date);

      const available = slots.filter((slot) =>
        isSlotAvailable(slot, duration, bookedSlots)
      );
      setAvailableSlots(available);

      if (available.length === 0) {
        setRescheduleError(
          "No available slots for the selected date and employee."
        );
      } else {
        setRescheduleError("");
      }
    } catch (error) {
      setRescheduleError("Failed to fetch available slots. Please try again.");
      setAvailableSlots([]);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setNewDate(date);
    setNewTime("");
    if (date && selectedBookingId && newFavoriteEmployee) {
      const selectedBooking = bookings.find((b) => b._id === selectedBookingId);
      const duration = selectedBooking
        ? 60 + (selectedBooking.relatedServices?.split(", ").length - 1) * 30
        : 60;
      fetchAvailableSlots(
        selectedBookingId,
        date,
        newFavoriteEmployee,
        duration
      );
    } else {
      setAvailableSlots([]);
    }
  };

  const handleEmployeeChange = (e) => {
    const employee = e.target.value;
    setNewFavoriteEmployee(employee);
    setNewTime("");
    if (newDate && selectedBookingId && employee) {
      const selectedBooking = bookings.find((b) => b._id === selectedBookingId);
      const duration = selectedBooking
        ? 60 + (selectedBooking.relatedServices?.split(", ").length - 1) * 30
        : 60;
      fetchAvailableSlots(selectedBookingId, newDate, employee, duration);
    } else {
      setAvailableSlots([]);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleRescheduleBooking = async () => {
    if (!selectedBookingId || !newDate || !newTime || !newFavoriteEmployee) {
      setRescheduleError("Please select a date, time, and employee.");
      return;
    }

    const selectedBooking = bookings.find(
      (booking) => booking._id === selectedBookingId
    );
    if (!selectedBooking) return;

    try {
      const email = localStorage.getItem("email");
      const response = await axios.post(
        `${BASE_URL}/api/users/reschedule/booking`,
        {
          email,
          orderId: selectedBooking.orderId,
          newDate,
          newTime,
          favoriteEmployee: newFavoriteEmployee,
        }
      );

      if (response.status === 200) {
        setBookings(
          bookings.map((booking) =>
            booking._id === selectedBookingId
              ? {
                  ...booking,
                  bookingDate: newDate,
                  bookingTime: newTime,
                  favoriteEmployee: newFavoriteEmployee,
                }
              : booking
          )
        );
        alert("Booking rescheduled successfully.");
        closeRescheduleModal();
      }
    } catch (error) {
      setRescheduleError(
        error.response?.data?.message ||
          "Failed to reschedule booking. Please try again."
      );
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;

    const selectedBooking = bookings.find(
      (booking) => booking._id === selectedBookingId
    );
    if (!selectedBooking) return;

    const isAdvancePayment =
      selectedBooking.PaidAmount === selectedBooking.totalAmount * 0.25;

    if (
      !isAdvancePayment &&
      selectedBooking.PaidAmount === selectedBooking.totalAmount
    ) {
      if (!validateUpiId(upiId)) {
        setUpiError("Please enter a valid UPI ID (e.g., name@bank)");
        return;
      }
    }

    try {
      const email = localStorage.getItem("email");
      const response = await axios.post(
        `${BASE_URL}/api/users/cancel/booking`,
        {
          email,
          orderId: selectedBooking.orderId,
          upiId:
            !isAdvancePayment &&
            selectedBooking.PaidAmount === selectedBooking.totalAmount
              ? upiId
              : null,
        }
      );

      if (response.status === 200) {
        setBookings(
          bookings.map((booking) =>
            booking._id === selectedBookingId
              ? {
                  ...booking,
                  status: "CANCELLED",
                  confirmed: "Cancelled",
                  refundedAmount: isAdvancePayment
                    ? 0
                    : response.data.refundedAmount,
                  upiId: isAdvancePayment ? null : response.data.upiId,
                  refundStatus: isAdvancePayment ? "NONE" : "PENDING",
                }
              : booking
          )
        );
        alert(
          `Booking cancelled successfully. ${
            isAdvancePayment
              ? "No refund applicable for advance payment."
              : `Refund is pending approval.`
          }`
        );
        closeCancelModal();
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to cancel booking. Please try again."
      );
    }
  };

  const handleSubmit = async () => {
    if (!selectedBookingId) return;

    const email = localStorage.getItem("email");
    const selectedBooking = bookings.find(
      (booking) => booking._id === selectedBookingId
    );
    if (!selectedBooking) return;

    try {
      const SP = await axios.get(`${BASE_URL}/api/admin/all/admins/data`);
      const emails = [...new Set(SP.data.map((admin) => admin.email))];
      const ratingArray = await axios.get(
        `${BASE_URL}/api/users/get/userRatings`
      );
      const ratingsData = ratingArray.data.ratings;
      const updatePromises = [];

      for (const parlorEmail of emails) {
        if (ratingsData[parlorEmail]) {
          const ratings = ratingsData[parlorEmail];
          const totalRatings = ratings.reduce(
            (total, rating) => total + rating,
            0
          );
          const avgRating = totalRatings / ratings.length;
          const countPeople = ratings.length;
          updatePromises.push(
            axios.post(`${BASE_URL}/api/users/update/spRating`, {
              parlorEmail,
              avgRating,
              countPeople,
            })
          );
        }
      }

      await Promise.all(updatePromises);

      const response = await axios.post(
        `${BASE_URL}/api/users/update/booking/rating`,
        {
          email,
          orderId: selectedBooking.orderId,
          userRating: rating,
          userReview: comment,
        }
      );

      if (response.status === 200) {
        setBookings(
          bookings.map((booking) =>
            booking._id === selectedBookingId
              ? { ...booking, rating, comment }
              : booking
          )
        );
        alert("Rating submitted successfully.");
        closeModal();
      }
    } catch (error) {
      alert("Failed to submit rating. Please try again.");
    }
  };

  const handleRatingClick = (bookingId) => {
    if (isMobile) {
      setHoveredBookingId(hoveredBookingId === bookingId ? null : bookingId);
    }
  };

  const handleComplaintSubmit = async () => {
    if (!selectedBookingId || !complaint) {
      alert("Please provide a complaint.");
      return;
    }

    const email = localStorage.getItem("email");
    const selectedBooking = bookings.find(
      (booking) => booking._id === selectedBookingId
    );
    if (!selectedBooking) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/update/booking/complaint`,
        {
          email,
          orderId: selectedBooking.orderId,
          userComplaint: complaint,
        }
      );

      if (response.status === 200) {
        setBookings(
          bookings.map((booking) =>
            booking._id === selectedBookingId
              ? { ...booking, complaint }
              : booking
          )
        );
        alert("Complaint submitted successfully.");
        closeComplaintModal();
      }
    } catch (error) {
      alert("Failed to submit complaint. Please try again.");
    }
  };

  const handleComplaintClick = (bookingId) => {
    if (isMobile) {
      setHoveredBookingId(hoveredBookingId === bookingId ? null : bookingId);
    }
  };

  const handlePaidBookings = () => {
    setFilterStatus("paid");
  };

  const handlePendingBookings = () => {
    setFilterStatus("pending");
  };

  const handleAllBookings = () => {
    setFilterStatus("all");
  };

  // Render reschedule modal
  const renderRescheduleModal = () => {
    const selectedBooking = bookings.find((b) => b._id === selectedBookingId);
    const duration = selectedBooking
      ? 60 + (selectedBooking.relatedServices?.split(", ").length - 1) * 30
      : 60;

    return (
      <div
        className="modal"
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          className="modal-content"
          style={{
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: "1rem",
              fontSize: "1.2rem",
              color: "#0e0f0f",
              fontWeight: "600",
            }}
          >
            Reschedule Booking
          </h3>
          <select
            value={newFavoriteEmployee}
            onChange={handleEmployeeChange}
            disabled={!manPower.length}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "0.9rem",
            }}
          >
            <option value="">
              {manPower.length === 0
                ? "No employees available"
                : "Select Employee"}
            </option>
            {manPower.map((employee) => (
              <option key={employee._id} value={employee.name}>
                {employee.name} ({employee.experience} years exp)
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newDate}
            onChange={handleDateChange}
            min={getTomorrowDate()}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "0.9rem",
            }}
          />
          <select
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            disabled={
              !newDate || !newFavoriteEmployee || availableSlots.length === 0
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "0.9rem",
            }}
          >
            <option value="">
              {availableSlots.length === 0 && newDate && newFavoriteEmployee
                ? "No slots available"
                : "Select Time"}
            </option>
            {availableSlots.map((slot, index) => (
              <option
                key={index}
                value={slot}
                disabled={!isSlotAvailable(slot, duration, bookedSlots)}
              >
                {slot}{" "}
                {!isSlotAvailable(slot, duration, bookedSlots)
                  ? isPastSlot(slot)
                    ? "(Past)"
                    : "(Booked)"
                  : ""}
              </option>
            ))}
          </select>
          {rescheduleError && (
            <p
              style={{ color: "red", fontSize: "0.9rem", marginBottom: "1rem" }}
            >
              {rescheduleError}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={handleRescheduleBooking}
              disabled={!newDate || !newTime || !newFavoriteEmployee}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#201548",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.9rem",
              }}
            >
              Confirm Reschedule
            </button>
            <button
              onClick={closeRescheduleModal}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.9rem",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "1rem",
        minHeight: "100vh",
        background: "#ffffff",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .modal-content {
            background: #ffffff;
            padding: 1.5rem;
            border-radius: 10px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.3s ease-out;
          }
          .star-rating {
            display: flex;
            justify-content: center;
            margin-bottom: 1rem;
          }
          .star {
            font-size: 1.5rem;
            color: #ccc;
            cursor: pointer;
            transition: color 0.2s;
          }
          .star.filled {
            color: #201548;
          }
          .modal-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 1rem;
            gap: 1.5rem;
          }
          .modal-buttons button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }
          .modal-buttons .post-btn {
            background: #201548;
            color: #ffffff;
          }
          .modal-buttons .post-btn:hover {
            background: #1a1138;
            transform: translateY(-2px);
          }
          .modal-buttons .cancel-btn {
            background: #F44336;
            color: #ffffff;
          }
          .modal-buttons .cancel-btn:hover {
            background: #d32f2f;
            transform: translateY(-2px);
          }
          .error-text {
            color: #F44336;
            font-size: 0.8rem;
            margin-top: 0.2rem;
          }
          input[type="text"], input[type="date"], select {
            width: 100%;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 0.9rem;
            color: #0e0f0f;
          }
          textarea {
            width: 100%;
            min-height: 80px;
            resize: vertical;
            margin-bottom: 1rem;
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 0.9rem;
            color: #0e0f0f;
          }
          .rating-container, .complaint-container {
            position: relative;
            display: inline-block;
          }
          .comment-popup, .complaint-popup {
            position: absolute;
            background: #ffffff;
            padding: 0.8rem;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 100;
            max-width: 150px;
            white-space: normal;
            top: -100%;
            left: 50%;
            transform: translate(-50%, -100%);
            font-size: 0.8rem;
            color: #0e0f0f;
          }
          @media (min-width: 769px) {
            .comment-popup, .complaint-popup {
              display: none;
            }
            .rating-container:hover .comment-popup,
            .complaint-container:hover .complaint-popup {
              display: block;
            }
          }
          @media (max-width: 768px) {
            .comment-popup, .complaint-popup {
              display: ${hoveredBookingId ? "block" : "none"};
            }
          }
          .filter-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
            justify-content: center;
          }
          .filter-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #201548;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            flex: 1;
            text-align: center;
            max-width: 150px;
            background: #ffffff;
            color: #201548;
          }
          .filter-btn.active {
            background: #201548;
            color: #ffffff;
          }
          .filter-btn:hover {
            background: #201548;
            color: #ffffff;
            transform: translateY(-2px);
          }
          .table-container {
            width: 100%;
            overflow-x: auto;
            background: #ffffff;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            padding: 1rem;
            margin-top: 1rem;
            animation: fadeIn 0.8s ease-out;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: auto;
          }
          th, td {
            padding: 0.8rem;
            text-align: left;
            border-bottom: 1px solid #e8ecef;
            white-space: normal;
            word-wrap: break-word;
            font-size: 0.9rem;
          }
          th {
            font-weight: 600;
            letter-spacing: 0.5px;
            color: #0e0f0f;
          }
          td {
            color: #0e0f0f;
            font-weight: 500;
          }
          tr:hover {
            background: rgba(32, 21, 72, 0.1);
            transform: scale(1.005);
          }
          .secret-pin-paid {
            color: #201548;
            font-weight: 600;
          }
          .refund-status {
            font-weight: 600;
          }
          .action-cancel, .action-reschedule, .action-pay {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            padding: 0.2rem 0.5rem;
            border-radius: 5px;
          }
          .action-cancel {
            color: rgb(34, 20, 9);
            background: rgb(224, 41, 41);
          }
          .action-cancel i {
            color: rgb(38, 23, 11);
          }
          .action-cancel:hover {
            color: #1a1138;
          }
          .action-cancel:hover i {
            color: #1a1138;
          }
          .action-reschedule {
            color: #ffffff;
            background: #201548;
          }
          .action-reschedule i {
            color: #ffffff;
          }
          .action-reschedule:hover {
            background: #1a1138;
          }
          .action-reschedule:hover i {
            color: #ffffff;
          }
          .action-pay {
            color: #ffffff;
            background: #4a3f8c;
          }
          .action-pay:hover {
            background: #6683a8;
          }
          .action-disabled {
            color: #ccc;
          }
          @media (max-width: 768px) {
            .table-container {
              padding: 0.5rem;
            }
            th, td {
              padding: 0.5rem;
              font-size: 0.8rem;
            }
            th:nth-child(4), td:nth-child(4),
            th:nth-child(10), td:nth-child(10) {
              display: none;
            }
            .filter-btn {
              font-size: 0.8rem;
              padding: 0.4rem 0.8rem;
              max-width: 120px;
            }
          }
          @media (max-width: 600px) {
            table, thead, tbody, th, td, tr {
              display: block;
            }
            thead {
              display: none;
            }
            tr {
              margin-bottom: 1rem;
              border: 1px solid #e8ecef;
              border-radius: 8px;
              background: #ffffff;
              padding: 0.5rem;
            }
            td {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0.5rem;
              font-size: 0.8rem;
              border: none;
              position: relative;
              color: #0e0f0f;
            }
            td::before {
              content: attr(data-label);
              font-weight: 600;
              color: #201548;
              flex: 1;
              padding-right: 0.5rem;
            }
            td:not(:last-child) {
              border-bottom: 1px solid #e8ecef;
            }
            td:nth-child(4),
            td:nth-child(10) {
              display: none;
            }
            .table-container {
              padding: 0.5rem;
            }
            .filter-buttons {
              flex-direction: column;
              gap: 0.3rem;
            }
            .filter-btn {
              font-size: 0.75rem;
              padding: 0.3rem;
              max-width: none;
            }
            .modal-content {
              padding: 1rem;
              max-width: 95%;
            }
            .star {
              font-size: 1.2rem;
            }
            .modal-buttons button {
              font-size: 0.8rem;
              padding: 0.4rem 0.8rem;
            }
            textarea, input[type="text"], input[type="date"], select {
              font-size: 0.8rem;
              min-height: 60px;
            }
          }
        `}
      </style>

      <div className="filter-buttons mt-5">
        <button
          className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
          onClick={handleAllBookings}
        >
          All Bookings
        </button>
        <button
          className={`filter-btn ${filterStatus === "paid" ? "active" : ""}`}
          onClick={handlePaidBookings}
        >
          Confirmed Bookings
        </button>
        <button
          className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
          onClick={handlePendingBookings}
        >
          Failures Bookings
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr style={{ background: "#e8ecef", color: "#0e0f0f" }}>
              <th style={headerCellStyle}>S.No</th>
              <th style={headerCellStyle}>Booking ID</th>
              <th style={headerCellStyle}>Transaction ID</th>
              <th style={headerCellStyle}>Service</th>
              <th style={headerCellStyle}>Related Services</th>
              <th style={headerCellStyle}>Date</th>
              <th style={headerCellStyle}>Time</th>
              <th style={headerCellStyle}>Parlor Name</th>
              <th style={headerCellStyle}>Employee Name</th>
              <th style={headerCellStyle}>Paid Amount</th>
              <th style={headerCellStyle}>Remaining Amount</th>
              <th style={headerCellStyle}>PIN</th>
              <th style={headerCellStyle}>Complaint</th>
              <th style={headerCellStyle}>Rating</th>
              <th style={headerCellStyle}>Refund Status</th>
              <th style={headerCellStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  style={{
                    transition: "all 0.3s ease",
                    ...(index % 2 === 1 && {
                      background: "rgba(32, 21, 72, 0.05)",
                    }),
                  }}
                >
                  <td style={tableCellStyle} data-label="S.No">
                    {index + 1}
                  </td>
                  <td style={tableCellStyle} data-label="Booking ID">
                    {booking.bookingId || "NA"}
                  </td>
                  <td style={tableCellStyle} data-label="Transaction ID">
                    {booking.transactionId || "NA"}
                  </td>
                  <td style={tableCellStyle} data-label="Service">
                    {booking.serviceName || "NA"}
                  </td>
                  <td style={tableCellStyle} data-label="Related Services">
                    {booking.relatedServices || "NA"}
                  </td>
                  <td style={tableCellStyle} data-label="Date">
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString()
                      : "NA"}
                  </td>
                  <td
                    style={{ ...tableCellStyle, whiteSpace: "nowrap" }}
                    data-label="Time"
                  >
                    {booking.bookingTime || "NA"}
                  </td>
                  <td style={tableCellStyle} data-label="Parlor Name">
                    {booking.parlorName || "NA"}
                  </td>
                  <td style={tableCellStyle} data-label="Favorite Employee">
                    {booking.favoriteEmployee || "NA"}
                  </td>
                  <td style={tableCellStyle} data-label="Paid Amount">
                    {booking.PaidAmount || "NA"}
                  </td>
                  <td style={tableCellStyle} data-label="Remaining Amount">
                    {booking.RemainingAmount > 0 ? (
                      <span
                        className="action-pay"
                        onClick={() => handlePayRemaining(booking)}
                      >
                        Pay ₹{booking.RemainingAmount}
                      </span>
                    ) : (
                      "₹0"
                    )}
                  </td>
                  <td style={tableCellStyle} data-label="PIN">
                    {booking.pin || "NA"}
                  </td>
                  <td style={tableCellStyle} data-label="Complaint">
                    {booking.complaint ? (
                      <div
                        className="complaint-container"
                        data-booking-id={booking._id}
                        onMouseEnter={() =>
                          !isMobile && setHoveredBookingId(booking._id)
                        }
                        onMouseLeave={() =>
                          !isMobile && setHoveredBookingId(null)
                        }
                        onClick={() => handleComplaintClick(booking._id)}
                      >
                        View{" "}
                        <i
                          className="fa-solid fa-eye"
                          style={{ color: "#201548" }}
                        ></i>
                        {hoveredBookingId === booking._id &&
                          booking.complaint && (
                            <div
                              className="complaint-popup"
                              data-booking-id={booking._id}
                            >
                              {booking.complaint}
                            </div>
                          )}
                      </div>
                    ) : booking.status?.toLowerCase() === "pending" ? (
                      <span style={{ color: "#ccc" }}>
                        <i
                          className="fa-solid fa-pen-to-square"
                          style={{ color: "#ccc", fontSize: "20px" }}
                        ></i>
                      </span>
                    ) : isPastDate(booking.bookingDate) ? (
                      <span
                        onClick={() => openComplaintModal(booking._id)}
                        style={{ cursor: "pointer", color: "#201548" }}
                      >
                        <i
                          className="fa-solid fa-pen-to-square"
                          style={{ color: "#201548", fontSize: "20px" }}
                        ></i>
                      </span>
                    ) : (
                      <span style={{ color: "#ccc" }}>
                        <i
                          className="fa-solid fa-pen-to-square"
                          style={{ color: "#ccc", fontSize: "20px" }}
                        ></i>
                      </span>
                    )}
                  </td>
                  <td style={tableCellStyle} data-label="Rating">
                    {booking.rating ? (
                      <div
                        className="rating-container"
                        data-booking-id={booking._id}
                        onMouseEnter={() =>
                          !isMobile && setHoveredBookingId(booking._id)
                        }
                        onMouseLeave={() =>
                          !isMobile && setHoveredBookingId(null)
                        }
                        onClick={() => handleRatingClick(booking._id)}
                      >
                        {booking.rating}{" "}
                        <i
                          className="fa-solid fa-star"
                          style={{ color: "#201548" }}
                        ></i>
                        {hoveredBookingId === booking._id &&
                          booking.comment && (
                            <div
                              className="comment-popup"
                              data-booking-id={booking._id}
                            >
                              {booking.comment}
                            </div>
                          )}
                      </div>
                    ) : booking.status?.toLowerCase() === "pending" ? (
                      <span style={{ color: "#ccc" }}>
                        Rate{" "}
                        <i
                          className="fa-regular fa-star"
                          style={{ color: "#ccc" }}
                        ></i>
                      </span>
                    ) : isPastDate(booking.bookingDate) ? (
                      <span
                        onClick={() => openModal(booking._id)}
                        style={{ cursor: "pointer", color: "#201548" }}
                      >
                        Rate{" "}
                        <i
                          className="fa-regular fa-star"
                          style={{ color: "#201548" }}
                        ></i>
                      </span>
                    ) : (
                      <span style={{ color: "#ccc" }}>
                        Rate{" "}
                        <i
                          className="fa-regular fa-star"
                          style={{ color: "#ccc" }}
                        ></i>
                      </span>
                    )}
                  </td>
                  <td style={tableCellStyle} data-label="Refund Status">
                    <span
                      className="refund-status"
                      style={{
                        color: getRefundStatusColor(booking.refundStatus),
                      }}
                    >
                      {booking.refundStatus || "NA"}
                      {booking.refundedAmount > 0 &&
                        ` (₹${booking.refundedAmount})`}
                    </span>
                  </td>
                  <td style={tableCellStyle} data-label="Action">
                    {booking.status?.toLowerCase() === "paid" &&
                    booking.confirmed !== "Cancelled" &&
                    isFutureDate(booking.bookingDate) ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <span
                          className="action-cancel"
                          onClick={() => openCancelModal(booking._id)}
                        >
                          Cancel <i className="fa-solid fa-times-circle" />
                        </span>
                        <span
                          className="action-reschedule"
                          onClick={() => openRescheduleModal(booking._id)}
                        >
                          Reschedule <i className="fa-solid fa-calendar-alt" />
                        </span>
                      </div>
                    ) : (
                      <span className="action-disabled">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="15"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#0e0f0f",
                    fontSize: "1.1rem",
                    background: "#ffffff",
                    display: "block",
                  }}
                >
                  No{" "}
                  {filterStatus === "paid"
                    ? "paid"
                    : filterStatus === "pending"
                    ? "pending"
                    : ""}{" "}
                  bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={handleBackdropClick}>
          <div className="modal-content">
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                fontSize: "1.2rem",
                color: "#0e0f0f",
              }}
            >
              Rate This Service
            </h3>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? "filled" : ""}`}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Add your comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="post-btn" onClick={handleSubmit}>
                Post
              </button>
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isComplaintModalOpen && (
        <div className="modal" onClick={handleBackdropClick}>
          <div className="modal-content">
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                fontSize: "1.2rem",
                color: "#0e0f0f",
              }}
            >
              File a Complaint
            </h3>
            <textarea
              placeholder="Describe your issue..."
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="post-btn" onClick={handleComplaintSubmit}>
                Submit
              </button>
              <button className="cancel-btn" onClick={closeComplaintModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isCancelModalOpen && (
        <div className="modal" onClick={handleBackdropClick}>
          <div className="modal-content">
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                fontSize: "1.2rem",
                color: "#0e0f0f",
              }}
            >
              Cancel Booking
            </h3>
            <p
              style={{
                marginBottom: "1rem",
                fontSize: "0.9rem",
                color: "#0e0f0f",
              }}
            >
              {bookings.find((b) => b._id === selectedBookingId)?.PaidAmount ===
              bookings.find((b) => b._id === selectedBookingId)?.totalAmount *
                0.25
                ? "Advance payment (25%) detected. No refund will be processed."
                : `Full payment detected. 25% will be deducted from refund. Refund amount: ₹${(
                    bookings.find((b) => b._id === selectedBookingId)
                      ?.PaidAmount * 0.75
                  ).toFixed(2)}`}
            </p>
            {bookings.find((b) => b._id === selectedBookingId)?.PaidAmount ===
              bookings.find((b) => b._id === selectedBookingId)
                ?.totalAmount && (
              <>
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g., name@bank)"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setUpiError("");
                  }}
                />
                {upiError && <p className="error-text">{upiError}</p>}
              </>
            )}
            <div className="modal-buttons">
              <button className="post-btn" onClick={handleCancelBooking}>
                Confirm Cancellation
                </button>
              <button className="cancel-btn" onClick={closeCancelModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isRescheduleModalOpen && renderRescheduleModal()}
    </div>
  );
};

const headerCellStyle = {
  textAlign: "left",
  fontWeight: "600",
  letterSpacing: "0.5px",
  color: "#0e0f0f",
};

const tableCellStyle = {
  borderBottom: "1px solid #e8ecef",
  color: "#0e0f0f",
  fontWeight: "500",
};

export default BookingPage;
