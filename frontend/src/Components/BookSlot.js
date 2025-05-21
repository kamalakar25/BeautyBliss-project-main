import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Typography,
  Alert,
  FormGroup,
  Modal,
  IconButton,
  Chip,
  Link,
} from "@mui/material";
import { ExpandMore, ExpandLess, Close } from "@mui/icons-material";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const BASE_URL = process.env.REACT_APP_API_URL;

const BookSlot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parlor = location.state?.parlor || {};

  // Initialize form data
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    service: parlor.service || "",
    amount: parlor.price || "",
    relatedServices: [],
    favoriteEmployee: "",
    duration: 0,
  });

  // State for service details from backend
  const [serviceDetails, setServiceDetails] = useState([]);
  const [serviceAll, setServiceAll] = useState([]);
  const [openModals, setOpenModals] = useState({});

  // State for terms agreement
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // State for terms and conditions from backend
  const [terms, setTerms] = useState([]);

  // State for form validation errors
  const [errors, setErrors] = useState({});

  // State for manPower (employees)
  const [manPower, setManPower] = useState([]);

  // State for booked time slots
  const [bookedSlots, setBookedSlots] = useState([]);

  // State for username
  const [username, setUsername] = useState("");

  // State for parlor timings
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Refs for form fields
  const nameRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const serviceRef = useRef(null);
  const amountRef = useRef(null);
  const favoriteEmployeeRef = useRef(null);
  const termsRef = useRef(null);

  // Fetch service details
  useEffect(() => {
    const serviceId = parlor.serviceId;
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/users/shop/by-service/${serviceId}`
        );
        setServiceAll(response.data.services);
      } catch (error) {
        console.error("Error fetching service details:", error);
        setErrors((prev) => ({
          ...prev,
          api: "Failed to fetch service details. Please try again.",
        }));
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [parlor.serviceId]);

  // Fetch parlor services
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!parlor.email) return;
      try {
        const response = await axios.get(
          `${BASE_URL}/api/admin/get-services/${parlor.email}`
        );
        setServiceDetails(response.data);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          api: "Failed to fetch service details. Please try again.",
        }));
        setServiceDetails([]);
      }
    };

    fetchServiceDetails();
  }, [parlor.email]);

  // Fetch username
  const fetchUsername = async () => {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      setErrors((prev) => ({
        ...prev,
        api: "User email not found. Please log in.",
      }));
      return;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/api/users/bookings/${userEmail}`
      );
      setUsername(response.data.username);
      setFormData((prev) => ({ ...prev, name: response.data.username }));
    } catch (error) {
      setUsername("");
      setFormData((prev) => ({ ...prev, name: "" }));
      setErrors((prev) => ({
        ...prev,
        api: "Failed to fetch username. Please try again.",
      }));
    }
  };

  // Fetch parlor timings
  const fetchParlorTimings = async () => {
    if (!parlor.email) return;
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/parlor/${parlor.email}`
      );
      const parlorData = response.data;
      if (
        parlorData.availableTime &&
        parlorData.availableTime.fromTime &&
        parlorData.availableTime.toTime
      ) {
        const { fromTime, toTime } = parlorData.availableTime;
        const slots = generateTimeSlots(fromTime, toTime, 60);
        setAvailableTimeSlots(slots);
      } else {
        setErrors((prev) => ({
          ...prev,
          api: "Parlor timings not available.",
        }));
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        api: "Failed to fetch parlor timings. Please try again.",
      }));
      setAvailableTimeSlots([]);
    }
  };

  // Fetch manPower
  const fetchManPower = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/get-manpower/${parlor.email}`
      );
      setManPower(response.data);
    } catch (error) {
      setManPower([]);
    }
  };

  // Fetch booked time slots
  const fetchBookedSlots = async (employeeName, date) => {
    const userEmail = localStorage.getItem("email");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/users/bookings/${userEmail}`
      );
      const filteredBookings = response.data.bookings
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

  // Fetch terms and conditions
  const fetchTerms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/terms/terms`);
      const uniqueTerms = Array.from(
        new Set(response.data.map((item) => item.term))
      ).map((term) => response.data.find((item) => item.term === term));
      setTerms(uniqueTerms);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        api: "Failed to fetch terms and conditions. Please try again.",
      }));
      setTerms([]);
    }
  };

  // Generate time slots
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

  // Calculate total duration
  const calculateTotalDuration = () => {
    if (!serviceDetails.length) return 0;

    const primaryService = serviceDetails.find(
      (svc) =>
        svc.serviceName === formData.service &&
        (!parlor.style || svc.style === parlor.style)
    );
    let totalDuration = primaryService?.duration || 0;

    formData.relatedServices.forEach((relatedService) => {
      const relatedServiceDetail = serviceDetails.find(
        (svc) =>
          svc.serviceName === relatedService || svc.style === relatedService
      );
      if (relatedServiceDetail) {
        totalDuration += relatedServiceDetail.duration || 0;
      }
    });

    return totalDuration;
  };

  // Update duration
  useEffect(() => {
    const totalDuration = calculateTotalDuration();
    setFormData((prev) => ({
      ...prev,
      duration: totalDuration,
    }));
  }, [serviceDetails, formData.service, formData.relatedServices]);

  // Fetch data on component mount
  useEffect(() => {
    fetchUsername();
    fetchParlorTimings();
    fetchTerms();
    fetchManPower();
  }, [parlor.email]);

  // Fetch booked slots
  useEffect(() => {
    if (formData.favoriteEmployee && formData.date) {
      fetchBookedSlots(formData.favoriteEmployee, formData.date);
    } else {
      setBookedSlots([]);
    }
  }, [formData.favoriteEmployee, formData.date]);

  // Calculate total amount
  const calculateTotalAmount = () => {
    const baseAmount = parseFloat(formData.amount) || 0;
    let totalAmount = baseAmount;

    formData.relatedServices.forEach((relatedService) => {
      const relatedServiceDetail = serviceDetails.find(
        (svc) =>
          svc.serviceName === relatedService || svc.style === relatedService
      );
      if (relatedServiceDetail) {
        totalAmount += parseFloat(relatedServiceDetail.price) || 0;
      }
    });

    return totalAmount;
  };

  // Time slot utilities
  const timeToMinutes = (time) => {
    const [start] = time.split("-");
    const [hours, minutes] = start.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isSlotAvailable = (slot, duration) => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + duration;

    for (const booked of bookedSlots) {
      const bookedStart = timeToMinutes(booked.time);
      const bookedEnd = bookedStart + booked.duration;

      if (!(slotEnd <= bookedStart || slotStart >= bookedEnd)) {
        return false;
      }
    }
    return true;
  };

  const isSlotAvailableWithDuration = (selectedTime, duration) => {
    if (!selectedTime) return true;
    const slotStart = timeToMinutes(selectedTime);
    const slotEnd = slotStart + duration;

    for (const booked of bookedSlots) {
      const bookedStart = timeToMinutes(booked.time);
      const bookedEnd = bookedStart + booked.duration;

      if (!(slotEnd <= bookedStart || slotStart >= bookedEnd)) {
        return false;
      }
    }
    return true;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "favoriteEmployee" || name === "date") {
      setFormData((prev) => ({ ...prev, time: "" }));
    }
  };

  const handleTermsChange = (e) => {
    setTermsAgreed(e.target.checked);
    setErrors((prev) => ({ ...prev, terms: "" }));
  };

  const handleTermsModalToggle = () => {
    setTermsModalOpen(!termsModalOpen);
  };

  // Handle related service changes
  const handleRelatedServiceChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      const newRelatedServices = [...formData.relatedServices, value];
      const totalDuration = calculateTotalDurationForServices([
        ...newRelatedServices,
        formData.service,
      ]);

      if (!isSlotAvailableWithDuration(formData.time, totalDuration)) {
        setErrors((prev) => ({
          ...prev,
          relatedServices:
            "Cannot add this service: Selected time is busy. Please select another slot.",
        }));
        return;
      }

      setErrors((prev) => ({ ...prev, relatedServices: "" }));
      setFormData((prev) => ({
        ...prev,
        relatedServices: newRelatedServices,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        relatedServices: prev.relatedServices.filter(
          (service) => service !== value
        ),
      }));
      setErrors((prev) => ({ ...prev, relatedServices: "" }));
    }
  };

  const calculateTotalDurationForServices = (services) => {
    let totalDuration = 0;
    services.forEach((service) => {
      const serviceDetail = serviceDetails.find(
        (svc) =>
          svc.serviceName === service ||
          svc.style === service ||
          (svc.serviceName === formData.service &&
            (!parlor.style || svc.style === parlor.style))
      );
      if (serviceDetail) {
        totalDuration += serviceDetail.duration || 0;
      }
    });
    return totalDuration;
  };

  const handleRemoveService = (serviceToRemove) => {
    setFormData((prev) => ({
      ...prev,
      relatedServices: prev.relatedServices.filter(
        (service) => service !== serviceToRemove
      ),
    }));
    setErrors((prev) => ({ ...prev, relatedServices: "" }));
  };

  const handleToggleModal = (category) => {
    setOpenModals((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
    setErrors((prev) => ({ ...prev, relatedServices: "" }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time slot is required";
    if (!formData.service) newErrors.service = "Service is required";
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0)
      newErrors.amount = "Valid amount is required";
    if (!formData.favoriteEmployee && manPower.length > 0)
      newErrors.favoriteEmployee = "Please select an employee";
    if (formData.time && !isSlotAvailable(formData.time, formData.duration))
      newErrors.time =
        "Selected time slot is not available for the required duration";
    if (!termsAgreed)
      newErrors.terms = "You must agree to the terms and conditions";
    if (formData.duration === 0)
      newErrors.duration = "Service duration not available";

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const fieldRefs = {
        name: nameRef,
        date: dateRef,
        time: timeRef,
        service: serviceRef,
        amount: amountRef,
        favoriteEmployee: favoriteEmployeeRef,
        terms: termsRef,
      };
      const targetRef = fieldRefs[firstErrorField];
      if (targetRef.current) {
        targetRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        const inputElement = targetRef.current.querySelector("input, select");
        if (inputElement) inputElement.focus();
      }
    }

    return newErrors;
  };

  // Handle booking
  const handleBookSlot = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      navigate("/pay", {
        state: {
          ...formData,
          parlor,
          totalAmount: calculateTotalAmount(),
          duration: formData.duration,
        },
      });
    } catch (error) {
      setErrors({
        ...errors,
        api: "Failed to proceed to payment. Please try again.",
      });
    }
  };

  // Parse location for Google Maps
  const parseLocation = (location) => {
    if (!location || typeof location !== "string") return null;
    const match = location.match(/Lat:\s*([\d.-]+),\s*Lon:\s*([\d.-]+)/i);
    if (!match) return null;
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    if (isNaN(lat) || isNaN(lon)) return null;
    return { lat, lon };
  };

  const getGoogleMapsUrl = (location) => {
    const coords = parseLocation(location);
    if (!coords) return "#";
    return `https://www.google.com/maps?q=${coords.lat},${coords.lon}`;
  };

  // Group services by serviceName
  const groupedServices = serviceAll.reduce((acc, service) => {
    const category = service.serviceName || "Unnamed Service";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  // Render service checkboxes
const renderServiceCheckboxes = () => {
  const categories = Object.keys(groupedServices);

  if (categories.length === 0) {
    return (
      <Typography
        variant="body1"
        sx={{
          mt: 2,
          color: "#666",
          fontStyle: "italic",
        }}
      >
        No Additional Services
      </Typography>
    );
  }

  return (
    <Box className="services-grid">
      {categories.map((category) => (
        <Box key={category}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": { color: "#201548" },
              transition: "all 0.3s ease",
            }}
            onClick={() => handleToggleModal(category)}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#0e0f0f",
                fontWeight: "500",
                fontSize: "0.9rem",
                flexGrow: 1,
              }}
            >
              {category}
            </Typography>
            <IconButton sx={{ padding: "0.25rem" }}>
              {openModals[category] ? (
                <ExpandLess sx={{ color: "#201548", fontSize: "1rem" }} />
              ) : (
                <ExpandMore sx={{ color: "#201548", fontSize: "1rem" }} />
              )}
            </IconButton>
          </Box>
          <Modal
            open={openModals[category] || false}
            onClose={() => handleToggleModal(category)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                bgcolor: "#ffffff",
                p: 3,
                borderRadius: 3,
                maxWidth: 450,
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
                transform: "scale(0.9)",
                animation: "modalPop 0.4s ease-out forwards",
                "&:hover": { transform: "scale(1)" },
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  color: "#0e0f0f",
                  fontWeight: "600",
                  fontSize: "1.2rem",
                }}
              >
                {category}
              </Typography>
              <FormGroup>
                {groupedServices[category].map((service, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={formData.relatedServices.includes(
                          service.style || service.serviceName
                        )}
                        onChange={handleRelatedServiceChange}
                        value={service.style || service.serviceName}
                        sx={{
                          color: "#d0d0d0",
                          "&.Mui-checked": { color: "#201548" },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{ fontSize: "0.9rem", color: "#0e0f0f" }}
                        >
                          {service.style || service.serviceName}
                        </Typography>
                        <Typography
                          sx={{
                            ml: 2,
                            fontSize: "0.8rem",
                            color: "#666",
                          }}
                        >
                          (₹{service.price}, {service.duration} min)
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
              <Button
                variant="contained"
                onClick={() => handleToggleModal(category)}
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#201548",
                  color: "#ffffff",
                  fontWeight: "500",
                  borderRadius: 2,
                  fontSize: "0.85rem",
                  "&:hover": {
                    backgroundColor: "#1a1138",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Close
              </Button>
            </Box>
          </Modal>
        </Box>
      ))}
    </Box>
  );
};


  // Render selected services
  const renderSelectedServices = () => {
    return (
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          animation: "slideIn 0.5s ease-out",
        }}
      >
        {formData.relatedServices.map((service) => (
          <Chip
            key={service}
            label={service}
            onDelete={() => handleRemoveService(service)}
            deleteIcon={<Close />}
            sx={{
              bgcolor: "#201548",
              color: "#ffffff",
              fontWeight: "500",
              fontSize: "0.85rem",
              "&:hover": {
                bgcolor: "#1a1138",
                transform: "scale(1.05)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              },
              transition: "all 0.2s ease",
              animation: "fadeIn 0.4s ease-out",
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <div className="container my-5">
      <style>
        {`
        .book-slot-container {
          background: #ffffff;
          border-radius: 14px;
          padding: 1rem;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: containerFadeIn 0.8s ease-in-out;
          max-width: 100%;
          margin: 0 auto;
        }

        .shop-info-card {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 12px;
          padding: 1.25rem;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border: 1px solid #e8ecef;
          animation: slideInLeft 0.6s ease-out;
          width: 100%;
          max-width: 400px;
        }

        .shop-info-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }

        .booking-form-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border: 1px solid #32226b;
          animation: slideInRight 0.6s ease-out;
          width: 100%;
          max-width: 600px;
        }

        .booking-form-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .service-category {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 40px;
          padding: 0.5rem;
        }

        .form-field {
          transition: all 0.3s ease;
          animation: fadeInUp 0.5s ease-out;
        }

        .form-field:hover {
          transform: translateY(-2px);
        }

        .full-width-field {
          grid-column: span 1;
        }

        .direction-button {
          border-radius: 8px;
          text-transform: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          background-color: #201548;
          color: #ffffff;
          animation: fadeIn 0.7s ease-out;
        }

        .direction-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
          background-color: #1a1138;
        }

        .book-slot-button {
          border-radius: 8px;
          text-transform: none;
          font-size: 1rem;
          padding: 0.6rem;
          font-weight: 500;
          transition: all 0.3s ease;
          background-color: #201548;
          color: #ffffff;
          animation: fadeIn 0.8s ease-out;
        }

        .book-slot-button:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
          background-color: #1a1138;
        }

        .parlor-image {
          border-radius: 10px;
          object-fit: cover;
          width: 100%;
          height: 140px;
          transition: transform 0.4s ease, filter 0.4s ease;
        }

        .parlor-image:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }

        .terms-link {
          cursor: pointer;
          color: #201548;
          text-decoration: underline;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .terms-link:hover {
          color: #1a1138;
        }

        .css-11hgk1s-MuiButtonBase-root-MuiChip-root .MuiChip-deleteIcon {
          -webkit-tap-highlight-color: transparent;
          color: rgba(255, 255, 255, 0.26);
          cursor: pointer;
          margin: 0 5px 0 -6px;
        }

        @keyframes containerFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(0.9); }
        }

        @media (min-width: 320px) and (max-width: 480px) {
          .book-slot-container {
            padding: 0.5rem;
            min-height: auto;
            align-items: flex-start;
          }
          .shop-info-card {
            padding: 0.75rem;
            margin-bottom: 1rem;
            max-width: 100%;
          }
          .booking-form-card {
            padding: 0.75rem;
            max-width: 100%;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .services-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .service-category {
            padding: 0.4rem;
            min-height: 36px;
          }
          .service-category h6 {
            font-size: 0.85rem;
          }
          .parlor-image {
            height: 100px;
          }
          .direction-button {
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
          }
          .book-slot-button {
            font-size: 0.8rem;
            padding: 0.5rem;
          }
          .booking-form-card h3 {
            font-size: 1.4rem;
          }
          .shop-info-card h5 {
            font-size: 1.2rem;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .book-slot-container {
            padding: 1rem;
            min-height: auto;
            align-items: flex-start;
          }
          .shop-info-card {
            padding: 1rem;
            margin-bottom: 1.5rem;
            max-width: 100%;
          }
          .booking-form-card {
            padding: 1rem;
            max-width: 100%;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .services-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .service-category {
            padding: 0.5rem;
            min-height: 38px;
          }
          .service-category h6 {
            font-size: 0.9rem;
          }
          .parlor-image {
            height: 120px;
          }
          .direction-button {
            font-size: 0.8rem;
          }
          .book-slot-button {
            font-size: 0.85rem;
          }
          .booking-form-card h3 {
            font-size: 1.6rem;
          }
          .shop-info-card h5 {
            font-size: 1.3rem;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .book-slot-container {
            padding: 1.5rem;
            max-width: 960px;
            margin: 0 auto;
          }
          .shop-info-card {
            padding: 1.25rem;
            max-width: 360 Dumas, Claude (French, 1946- )px;
          }
          .booking-form-card {
            padding: 1.5rem;
            max-width: 560px;
          }
          .form-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
          .services-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }
          .service-category {
            padding: 0.5rem;
            min-height: 40px;
          }
          .service-category h6 {
            font-size: 0.9rem;
          }
          .full-width-field {
            grid-column: span 2;
          }
          .parlor-image {
            height: 130px;
          }
          .direction-button {
            font-size: 0.85rem;
          }
          .book-slot-button {
            font-size: 0.9rem;
          }
          .booking-form-card h3 {
            font-size: 1.7rem;
          }
          .shop-info-card h5 {
            font-size: 1.35rem;
          }
        }

        @media (min-width: 1025px) and (max-width: 1440px) {
          .book-slot-container {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .shop-info-card {
            padding: 1.5rem;
            max-width: 400px;
          }
          .booking-form-card {
            padding: 2rem;
            max-width: 600px;
            margin-left: 1rem;
          }
          .form-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
          .services-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }
          .service-category {
            padding: 0.5rem;
            min-height: 40px;
          }
          .service-category h6 {
            font-size: 0.9rem;
          }
          .full-width-field {
            grid-column: span 2;
          }
          .parlor-image {
            height: 140px;
          }
          .direction-button {
            font-size: 0.85rem;
            padding: 0.5rem 1.2rem;
          }
          .book-slot-button {
            font-size: 0.95rem;
            padding: 0.7rem;
          }
          .booking-form-card h3 {
            font-size: 1.8rem;
          }
          .shop-info-card h5 {
            font-size: 1.4rem;
          }
        }

        @media (min-width: 1441px) {
          .book-slot-container {
            padding: 2.5rem;
            max-width: 1400px;
            margin: 0 auto;
          }
          .shop-info-card {
            padding: 1.75rem;
            max-width: 450px;
          }
          .booking-form-card {
            padding: 2.5rem;
            max-width: 650px;
            margin-left: 1.5rem;
          }
          .form-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.75rem;
          }
          .services-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .service-category {
            padding: 0.6rem;
            min-height: 44px;
          }
          .service-category h6 {
            font-size: 1rem;
          }
          .full-width-field {
            grid-column: span 2;
          }
          .parlor-image {
            height: 160px;
          }
          .direction-button {
            font-size: 0.9rem;
            padding: 0.6rem 1.4rem;
          }
          .book-slot-button {
            font-size: 1rem;
            padding: 0.8rem;
          }
          .booking-form-card h3 {
            font-size: 2rem;
          }
          .shop-info-card h5 {
            font-size: 1.5rem;
          }
        }
        `}
      </style>

      <div className="container my-5">
        <div className="book-slot-container">
          <div className="row g-4">
            {/* Left Section - Shop Info */}
            <div className="col-12 col-md-4">
              <Box className="shop-info-card text-center">
                {Object.keys(parlor).length === 0 ? (
                  <Alert
                    severity="warning"
                    sx={{
                      borderRadius: 2,
                      fontSize: "0.85rem",
                      animation: "fadeIn 0.5s ease-out",
                    }}
                  >
                    No parlor data available. Please select a parlor.
                  </Alert>
                ) : (
                  <>
                    <img
                      src={`${BASE_URL}/${parlor.image}`}
                      alt={parlor.name || "Shop"}
                      className="parlor-image mb-3"
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#0e0f0f",
                        fontWeight: "600",
                        mb: 1,
                        fontSize: "1.4rem",
                      }}
                    >
                      {parlor.name || "Shop Name"}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#201548",
                        mb: 1,
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      {parlor.designation || "Designation"}
                    </Typography>
                    <Typography
                      sx={{ color: "#0e0f0f", mb: 1, fontSize: "0.85rem" }}
                    >
                      {parlor.style || "Style"}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#0e0f0f",
                        mb: 1,
                        fontWeight: "500",
                        fontSize: "0.85rem",
                      }}
                    >
                      Price: ₹{calculateTotalAmount()}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#0e0f0f",
                        mb: 1,
                        fontWeight: "500",
                        fontSize: "0.85rem",
                      }}
                    >
                      Duration: {formData.duration} minutes
                    </Typography>
                    <Typography
                      sx={{
                        color: "#0e0f0f",
                        mb: 2,
                        fontWeight: "500",
                        fontSize: "0.85rem",
                      }}
                    >
                      Rating: {parlor.spRating || "0"}
                    </Typography>
                    <Button
                      variant="outlined"
                      className="direction-button"
                      onClick={() =>
                        window.open(getGoogleMapsUrl(parlor.location), "_blank")
                      }
                      disabled={!parlor.location}
                      sx={{
                        color: "#201548",
                        borderColor: "#201548",
                        "&:hover": {
                          backgroundColor: "rgba(32, 21, 72, 0.1)",
                          borderColor: "#1a1138",
                          color: "#1a1138",
                        },
                      }}
                    >
                      Get Directions
                    </Button>
                  </>
                )}
              </Box>
            </div>

            {/* Right Section - Payment Form */}
            <div className="col-12 col-md-8">
              <Box className="booking-form-card">
                <Typography
                  variant="h3"
                  sx={{
                    mb: 2,
                    textAlign: "center",
                    color: "#0e0f0f",
                    fontWeight: "600",
                    fontSize: "1.8rem",
                    animation: "fadeIn 0.6s ease-out",
                  }}
                >
                  Book Your Slot
                </Typography>

                {Object.keys(parlor).length === 0 && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      fontSize: "0.85rem",
                      animation: "fadeIn 0.5s ease-out",
                    }}
                  >
                    Please select a parlor to proceed with booking.
                  </Alert>
                )}

                {errors.api && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      fontSize: "0.85rem",
                      animation: "fadeIn 0.5s ease-out",
                    }}
                  >
                    {errors.api}
                  </Alert>
                )}

                {errors.relatedServices && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      fontSize: "0.85rem",
                      animation: "fadeIn 0.5s ease-out",
                    }}
                  >
                    {errors.relatedServices}
                  </Alert>
                )}

                <Box className="form-grid">
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    disabled
                    className="form-field"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#201548" },
                        "&.Mui-focused fieldset": { borderColor: "#201548" },
                        backgroundColor: "#ffffff",
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#201548" },
                      "& .MuiInputBase-input": {
                        fontSize: "0.9rem",
                        color: "#0e0f0f",
                      },
                    }}
                    error={!!errors.name}
                    helperText={errors.name}
                    inputRef={nameRef}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    name="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date}
                    onChange={(e) => {
                      const { value } = e.target;
                      const selectedDate = new Date(value);
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(0, 0, 0, 0);

                      if (selectedDate < tomorrow) {
                        setErrors((prev) => ({
                          ...prev,
                          date: "Dates before tomorrow are not allowed",
                        }));
                      } else {
                        setErrors((prev) => ({ ...prev, date: "" }));
                        setFormData((prev) => ({ ...prev, date: value }));
                      }
                    }}
                    className="form-field"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#201548" },
                        "&.Mui-focused fieldset": { borderColor: "#201548" },
                        backgroundColor: "#ffffff",
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#201548" },
                      "& .MuiInputBase-input": {
                        fontSize: "0.9rem",
                        color: "#0e0f0f",
                      },
                    }}
                    error={!!errors.date}
                    helperText={errors.date}
                    inputProps={{
                      min: new Date(
                        new Date().setDate(new Date().getDate() + 1)
                      )
                        .toISOString()
                        .split("T")[0],
                    }}
                    inputRef={dateRef}
                  />
                  <FormControl
                    fullWidth
                    className="form-field"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#201548" },
                        "&.Mui-focused fieldset": { borderColor: "#201548" },
                        backgroundColor: "#ffffff",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "0.9rem",
                        color: "#0e0f0f",
                      },
                    }}
                    error={!!errors.favoriteEmployee}
                  >
                    <InputLabel
                      sx={{
                        "&.Mui-focused": { color: "#201548" },
                        fontSize: "0.9rem",
                        color: "#0e0f0f",
                      }}
                    >
                      Favorite Employee
                    </InputLabel>
                    <Select
                      name="favoriteEmployee"
                      value={formData.favoriteEmployee}
                      onChange={handleInputChange}
                      label="Favorite Employee"
                      inputRef={favoriteEmployeeRef}
                    >
                      <MenuItem
                        value=""
                        disabled
                        sx={{ fontSize: "0.9rem", color: "#0e0f0f" }}
                      >
                        Select an employee
                      </MenuItem>
                      {manPower.map((employee) => (
                        <MenuItem
                          key={employee._id}
                          value={employee.name}
                          sx={{ fontSize: "0.9rem", color: "#0e0f0f" }}
                        >
                          {employee.name} ({employee.experience} years exp)
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.favoriteEmployee && (
                      <Typography
                        color="error"
                        sx={{ mt: 0.5, fontSize: "0.8rem" }}
                      >
                        {errors.favoriteEmployee}
                      </Typography>
                    )}
                  </FormControl>
                  <FormControl
                    fullWidth
                    className="form-field"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#201548" },
                        "&.Mui-focused fieldset": { borderColor: "#201548" },
                        backgroundColor: "#ffffff",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "0.9rem",
                        color: "#0e0f0f",
                      },
                    }}
                    error={!!errors.time}
                  >
                    <InputLabel
                      sx={{
                        "&.Mui-focused": { color: "#201548" },
                        fontSize: "0.9rem",
                        color: "#0e0f0f",
                      }}
                    >
                      Available Time
                    </InputLabel>
                    <Select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      label="Available Time"
                      disabled={
                        !formData.date ||
                        !formData.favoriteEmployee ||
                        availableTimeSlots.length === 0 ||
                        formData.duration === 0
                      }
                      inputRef={timeRef}
                    >
                      <MenuItem
                        value=""
                        disabled
                        sx={{ fontSize: "0.9rem", color: "#0e0f0f" }}
                      >
                        {availableTimeSlots.length === 0
                          ? "No available time slots"
                          : formData.duration === 0
                          ? "Service duration not available"
                          : "Select a time slot"}
                      </MenuItem>
                      {availableTimeSlots.map((slot) => (
                        <MenuItem
                          key={slot}
                          value={slot}
                          disabled={!isSlotAvailable(slot, formData.duration)}
                          sx={{ fontSize: "0.9rem" }}
                        >
                          {slot}{" "}
                          {!isSlotAvailable(slot, formData.duration)
                            ? "(Booked)"
                            : ""}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.time && (
                      <Typography
                        color="error"
                        sx={{ mt: 0.5, fontSize: "0.8rem" }}
                      >
                        {errors.time}
                      </Typography>
                    )}
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="form-field"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#201548" },
                        "&.Mui-focused fieldset": { borderColor: "#201548" },
                        backgroundColor: "#ffffff",
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#201548" },
                      "& .MuiInputBase-input": {
                        fontSize: "0.9rem",
                        color: "#0e0f0f",
                      },
                    }}
                    InputProps={{ readOnly: true }}
                    error={!!errors.service}
                    helperText={errors.service}
                    inputRef={serviceRef}
                  />
                  <TextField
                    fullWidth
                    label="Total Amount"
                    name="totalAmount"
                    type="number"
                    value={calculateTotalAmount()}
                    className="form-field"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#201548" },
                        "&.Mui-focused fieldset": { borderColor: "#201548" },
                        backgroundColor: "#ffffff",
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#201548" },
                      "& .MuiInputBase-input": {
                        fontSize: "0.9rem",
                        color: "#0e0f0f",
                      },
                    }}
                    InputProps={{ readOnly: true }}
                    error={!!errors.amount}
                    helperText={errors.amount}
                    inputRef={amountRef}
                  />
                  <TextField
                    fullWidth
                    label="Total Duration (minutes)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    className="form-field full-width-field"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#201548" },
                        "&.Mui-focused fieldset": { borderColor: "#201548" },
                        backgroundColor: "#ffffff",
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#201548" },
                      "& .MuiInputBase-input": {
                        fontSize: "0.9rem",
                        color: "#0e0f0f",
                      },
                    }}
                    InputProps={{ readOnly: true }}
                    error={!!errors.duration}
                    helperText={errors.duration}
                  />
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    mb: 1,
                    color: "#0e0f0f",
                    fontWeight: "500",
                    fontSize: "1.2rem",
                    animation: "fadeIn 0.6s ease-out",
                  }}
                >
                  Additional Services (Additional charges may apply)
                </Typography>
                {renderServiceCheckboxes()}
                {formData.relatedServices.length > 0 &&
                  renderSelectedServices()}

                  

               

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    animation: "fadeIn 0.6s ease-out",
                  }}
                  ref={termsRef}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAgreed}
                        onChange={handleTermsChange}
                        sx={{
                          color: "#d0d0d0",
                          "&.Mui-checked": { color: "#201548" },
                          transition: "color 0.2s ease",
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.9rem", color: "#0e0f0f" }}>
                        I agree to the{" "}
                        <Link
                          className="terms-link"
                          onClick={handleTermsModalToggle}
                          sx={{ fontSize: "0.9rem" }}
                        >
                          Terms & Conditions
                        </Link>
                      </Typography>
                    }
                    sx={{
                      "&:hover": { bgcolor: "#f7f7f7", borderRadius: 1 },
                      animation: "fadeIn 0.5s ease-out",
                    }}
                  />
                </Box>
                {errors.terms && (
                  <Typography
                    color="error"
                    sx={{ mt: 0.5, fontSize: "0.8rem" }}
                  >
                    {errors.terms}
                  </Typography>
                )}

                <Modal
                  open={termsModalOpen}
                  onClose={handleTermsModalToggle}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#ffffff",
                      p: 3,
                      borderRadius: 3,
                      maxWidth: 450,
                      maxHeight: "80vh",
                      overflowY: "auto",
                      boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
                      transform: "scale(0.9)",
                      animation: "modalPop 0.4s ease-out forwards",
                      "&:hover": { transform: "scale(1)" },
                      transition: "transform 0.3s ease-in-out",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        color: "#0e0f0f",
                        fontWeight: "600",
                        fontSize: "1.2rem",
                      }}
                    >
                      Terms & Conditions
                    </Typography>
                    {terms.length > 0 ? (
                      terms.map((term, index) => (
                        <Typography
                          key={index}
                          sx={{
                            mb: 1,
                            fontSize: "0.9rem",
                            color: "#0e0f0f",
                          }}
                        >
                          {index + 1}. {term.term}
                        </Typography>
                      ))
                    ) : (
                      <Typography
                        sx={{
                          mb: 2,
                          fontSize: "0.9rem",
                          color: "#0e0f0f",
                        }}
                      >
                        No terms and conditions available.
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      onClick={handleTermsModalToggle}
                      fullWidth
                      sx={{
                        backgroundColor: "#201548",
                        color: "#ffffff",
                        fontWeight: "500",
                        borderRadius: 2,
                        fontSize: "0.85rem",
                        padding: "0.5rem 1rem",
                        "&:hover": {
                          backgroundColor: "#1a1138",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                </Modal>

                <Button
                  variant="contained"
                  onClick={handleBookSlot}
                  fullWidth
                  className="book-slot-button"
                  sx={{
                    mt: 2,
                    backgroundColor: "#ffffff",
                    border: "1px solid #201548",
                    color: "#201548",
                    "&:hover": { backgroundColor: "#201548", color: "#ffffff" },
                    "&:disabled": {
                      backgroundColor: "#cccccc",
                      color: "#888888",
                    },
                    fontSize: "0.9rem",
                    animation: "fadeIn 0.8s ease-out",
                  }}
                  disabled={
                    Object.keys(parlor).length === 0 || formData.duration === 0
                  }
                >
                  Book Slot
                </Button>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
