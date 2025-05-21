// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./SpBookingDetails.css";

// const BASE_URL = process.env.REACT_APP_API_URL;

// // ConfirmationModal Component
// const ConfirmationModal = ({
//   isOpen,
//   onClose,
//   booking,
//   inputId,
//   setInputId,
//   isConfirmed,
//   setIsConfirmed,
//   error,
//   setError,
//   onConfirm,
//   isConfirmEnabled,
// }) => {
//   if (!isOpen || !booking) return null;

//   const handleSubmit = async () => {
//     const userEmail = localStorage.getItem("email");

//     if (inputId === booking.pin) {
//       try {
//         const response = await axios.put(
//           `${BASE_URL}/api/users/update-confirmation`,
//           {
//             email: userEmail,
//             bookingId: booking._id,
//           }
//         );

//         setIsConfirmed(true);
//         setError("");
//         onConfirm(booking._id);
//         console.log("Confirmation updated:", response.data);
//       } catch (err) {
//         console.error("Error updating booking confirmation:", err);
//         setError("Failed to confirm booking. Please try again later.");
//       }
//     } else {
//       setError("Invalid PIN. Please try again.");
//     }
//   };

//   return (
//     <div className="modal-backdrop">
//       <div className="confirmation-modal">
//         {!isConfirmed ? (
//           <>
//             <h3 className="modal-title">Verify PIN</h3>
//             <input
//               type="text"
//               placeholder="Enter Secret PIN"
//               value={inputId}
//               onChange={(e) => setInputId(e.target.value)}
//               className={`modal-input ${error ? "error" : ""}`}
//             />
//             {error && <p className="error-message">{error}</p>}
//             {!isConfirmEnabled && (
//               <p className="error-message">
//                 Confirmation is only allowed on the booking date and time.
//               </p>
//             )}
//             <div className="modal-actions">
//               <button
//                 className="submit-btn"
//                 onClick={handleSubmit}
//                 disabled={!isConfirmEnabled}
//               >
//                 Submit
//               </button>
//               <button className="cancel-btn" onClick={onClose}>
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="success-icon">
//               <svg
//                 width="30"
//                 height="30"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#fff"
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M20 6L9 17l-5-5" />
//               </svg>
//             </div>
//             <h3 className="modal-title">Booking Confirmed!</h3>
//             <p className="modal-text">
//               PIN: {booking.pin} verified successfully.
//             </p>
//             <button className="close-btn" onClick={onClose}>
//               Close
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // ComplaintModal Component
// const ComplaintModal = ({
//   isOpen,
//   onClose,
//   booking,
//   complaintText,
//   setComplaintText,
//   isSubmitted,
//   setIsSubmitted,
//   error,
//   setError,
//   onSubmit,
// }) => {
//   if (!isOpen || !booking) return null;

//   const handleSubmit = async () => {
//     const userEmail = localStorage.getItem("email");

//     if (complaintText.trim() === "") {
//       setError("Please enter a complaint.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/users/submit-complaint`,
//         {
//           email: userEmail,
//           bookingId: booking._id,
//           complaint: complaintText,
//         }
//       );

//       setIsSubmitted(true);
//       setError("");
//       onSubmit(booking._id);
//       console.log("Complaint submitted:", response.data);
//     } catch (err) {
//       console.error("Error submitting complaint:", err);
//       setError("Failed to submit complaint. Please try again later.");
//     }
//   };

//   return (
//     <div className="modal-backdrop">
//       <div className="complaint-modal">
//         {!isSubmitted ? (
//           <>
//             <h3 className="modal-title">Submit Complaint</h3>
//             <textarea
//               placeholder="Describe your complaint..."
//               value={complaintText}
//               onChange={(e) => setComplaintText(e.target.value)}
//               className={`modal-textarea ${error ? "error" : ""}`}
//             />
//             {error && <p className="error-message">{error}</p>}
//             <div className="modal-actions">
//               <button className="submit-btn" onClick={handleSubmit}>
//                 Submit
//               </button>
//               <button className="cancel-btn" onClick={onClose}>
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="success-icon">
//               <svg
//                 width="30"
//                 height="30"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#fff"
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M20 6L9 17l-5-5" />
//               </svg>
//             </div>
//             <h3 className="modal-title">Complaint Submitted!</h3>
//             <button className="close-btn" onClick={onClose}>
//               Close
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // ComplaintViewModal Component
// const ComplaintViewModal = ({ isOpen, onClose, booking }) => {
//   const modalRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen || !booking) return null;

//   return (
//     <div className="modal-backdrop">
//       <div className="complaint-view-modal" ref={modalRef}>
//         <button className="modal-close-btn" onClick={onClose}>
//           ✕
//         </button>
//         <h3 className="modal-title">Complaint Details</h3>
//         <p className="modal-text">
//           <strong>Booking ID:</strong> {booking._id}
//         </p>
//         <p className="modal-text">
//           <strong>Service Provider Complaint:</strong>{" "}
//           {booking.spComplaint || "No complaint provided."}
//         </p>
//       </div>
//     </div>
//   );
// };

// // PaymentModal Component
// const PaymentModal = ({
//   isOpen,
//   onClose,
//   booking,
//   paymentAmount,
//   setPaymentAmount,
//   isPaid,
//   setIsPaid,
//   error,
//   setError,
//   onPayment,
// }) => {
//   if (!isOpen || !booking) return null;

//   const remainingAmount = booking.total_amount - (booking.amount || 0);

//   const handleSubmit = async () => {
//     const amountToPay = parseFloat(paymentAmount);

//     if (!amountToPay || amountToPay <= 0) {
//       setError("Please enter a valid payment amount.");
//       return;
//     }

//     if (amountToPay > remainingAmount) {
//       setError(
//         `Payment amount cannot exceed remaining amount of ${remainingAmount}.`
//       );
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/users/collect/payment`,
//         {
//           bookingId: booking._id,
//           paymentAmount: amountToPay,
//         }
//       );

//       setIsPaid(true);
//       setError("");
//       onPayment(booking._id, amountToPay, response.data.paymentStatus);
//       console.log("Payment updated:", response.data);
//     } catch (err) {
//       console.error("Error updating payment:", err);
//       setError("Failed to process payment. Please try again later.");
//     }
//   };

//   return (
//     <div className="modal-backdrop">
//       <div className="payment-modal">
//         {!isPaid ? (
//           <>
//             <h3 className="modal-title">Collect Payment</h3>
//             <p className="modal-text">Remaining Amount: {remainingAmount}</p>
//             <input
//               type="number"
//               placeholder="Enter Payment Amount"
//               value={paymentAmount}
//               onChange={(e) => setPaymentAmount(e.target.value)}
//               className={`modal-input ${error ? "error" : ""}`}
//             />
//             {error && <p className="error-message">{error}</p>}
//             <div className="modal-actions">
//               <button className="submit-btn" onClick={handleSubmit}>
//                 Submit
//               </button>
//               <button className="cancel-btn" onClick={onClose}>
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="success-icon">
//               <svg
//                 width="30"
//                 height="30"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#fff"
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M20 6L9 17l-5-5" />
//               </svg>
//             </div>
//             <h3 className="modal-title">Payment Collected!</h3>
//             <p className="modal-text">Amount {paymentAmount} collected</p>
//             <button className="close-btn" onClick={onClose}>
//               Close
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // SpBookingDetails Component
// const SpBookingDetails = () => {
//   const [bookings, setBookings] = useState([]);
//   const [filterText, setFilterText] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [screenWidth, setScreenWidth] = useState(window.innerWidth);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [isComplaintViewModalOpen, setIsComplaintViewModalOpen] = useState(false);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);
//   const [inputId, setInputId] = useState("");
//   const [complaintText, setComplaintText] = useState("");
//   const [paymentAmount, setPaymentAmount] = useState("");
//   const [isConfirmed, setIsConfirmed] = useState(false);
//   const [isComplaintSubmitted, setIsComplaintSubmitted] = useState(false);
//   const [isPaid, setIsPaid] = useState(false);
//   const [error, setError] = useState("");
//   const [complaintError, setComplaintError] = useState("");
//   const [paymentError, setPaymentError] = useState("");
//   const itemsPerPage = 5;

//   useEffect(() => {
//     const email = localStorage.getItem("email");
//     fetch(`${BASE_URL}/api/users/sp/bookings/${email}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setBookings(data);
//         console.log("Fetched bookings:", data);
//       })
//       .catch((err) => console.error("Failed to fetch bookings:", err));
//   }, []);

//   useEffect(() => {
//     const handleResize = () => setScreenWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const filteredBookings = [...bookings]
//     .reverse()
//     .filter((booking) =>
//       Object.values(booking).some(
//         (value) =>
//           value &&
//           value.toString().toLowerCase().includes(filterText.toLowerCase())
//       )
//     );

//   const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

//   const paginate = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const isConfirmEnabled = (booking) => {
//     if (!booking.date || !booking.time) return false;

//     try {
//       const now = new Date();
//       const bookingDate = new Date(booking.date);
//       const [time, period] = booking.time.split(" ");
//       let [hours, minutes] = time.split(":").map(Number);
//       if (period === "PM" && hours !== 12) hours += 12;
//       if (period === "AM" && hours === 12) hours = 0;

//       const bookingDateTime = new Date(bookingDate);
//       bookingDateTime.setHours(hours, minutes, 0, 0);

//       // Enable confirmation only if current time is on the booking date and within the time
//       return (
//         now.toDateString() === bookingDateTime.toDateString() &&
//         now.getHours() >= hours &&
//         now.getHours() <= hours + 1 // Assuming 1-hour window for confirmation
//       );
//     } catch (e) {
//       console.error("Error parsing booking date/time:", e);
//       return false;
//     }
//   };

//   const handleConfirmBooking = (bookingId) => {
//     setSelectedBookingId(bookingId);
//     setInputId("");
//     setIsConfirmed(false);
//     setError("");
//     setIsModalOpen(true);
//   };

//   const handleComplaintBooking = (bookingId) => {
//     setSelectedBookingId(bookingId);
//     setComplaintText("");
//     setIsComplaintSubmitted(false);
//     setComplaintError("");
//     setIsComplaintModalOpen(true);
//   };

//   const handleViewComplaint = (bookingId) => {
//     setSelectedBookingId(bookingId);
//     setIsComplaintViewModalOpen(true);
//   };

//   const handleCollectPayment = (bookingId) => {
//     setSelectedBookingId(bookingId);
//     setPaymentAmount("");
//     setIsPaid(false);
//     setPaymentError("");
//     setIsPaymentModalOpen(true);
//   };

//   const handleConfirmSuccess = (bookingId) => {
//     setBookings(
//       bookings.map((booking) =>
//         booking._id === bookingId
//           ? { ...booking, confirmed: "Confirmed" }
//           : booking
//       )
//     );
//     setIsConfirmed(true);
//   };

//   const handleComplaintSuccess = (bookingId) => {
//     setBookings(
//       bookings.map((booking) =>
//         booking._id === bookingId
//           ? { ...booking, spComplaint: complaintText }
//           : booking
//       )
//     );
//     setIsComplaintSubmitted(true);
//   };

//   const handlePaymentSuccess = (bookingId, amountPaid, paymentStatus) => {
//     setBookings(
//       bookings.map((booking) =>
//         booking._id === bookingId
//           ? {
//               ...booking,
//               amount: (booking.amount || 0) + amountPaid,
//               paymentStatus: paymentStatus,
//             }
//           : booking
//       )
//     );
//     setIsPaid(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedBookingId(null);
//     setInputId("");
//     setIsConfirmed(false);
//     setError("");
//   };

//   const closeComplaintModal = () => {
//     setIsComplaintModalOpen(false);
//     setSelectedBookingId(null);
//     setComplaintText("");
//     setIsComplaintSubmitted(false);
//     setComplaintError("");
//   };

//   const closeComplaintViewModal = () => {
//     setIsComplaintViewModalOpen(false);
//     setSelectedBookingId(null);
//   };

//   const closePaymentModal = () => {
//     setIsPaymentModalOpen(false);
//     setSelectedBookingId(null);
//     setPaymentAmount("");
//     setIsPaid(false);
//     setPaymentError("");
//   };

//   const isMobile = screenWidth <= 768;
//   const isVerySmallScreen = screenWidth <= 400;

//   const visibleColumns = [
//     "S.No",
//     "Booking ID",
//     "User Mail",
//     "Staffed",
//     "Service",
//     "Date & Time",
//     "Receipt",
//     "Balance",
//     "Report",
//     "Claim",
//     "Confirm",
//   ];

//   // Format date and time safely
//   const formatDateTime = (date, time) => {
//     let dateStr = "N/A";
//     let timeStr = time || "N/A";

//     if (date) {
//       try {
//         const parsedDate = new Date(date);
//         if (!isNaN(parsedDate)) {
//           dateStr = parsedDate.toLocaleDateString();
//         }
//       } catch (e) {
//         console.error("Invalid date format:", date);
//       }
//     }

//     return (
//       <td
//         dangerouslySetInnerHTML={{
//           __html: `${dateStr}${timeStr !== "N/A" ? `<br>${timeStr}` : ""}`,
//         }}
//       />
//     );
//   };

//   return (
//     <div className="sp-booking-details">
//       <h2 className="page-title">All Bookings</h2>

//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search by any field in bookings..."
//           value={filterText}
//           onChange={(e) => {
//             setFilterText(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="search-input"
//         />
//       </div>

//       <div className="bookings-table">
//         {isMobile ? (
//           <div className="mobile-bookings-list">
//             {currentItems.length > 0 ? (
//               currentItems.map((booking, index) => (
//                 <div key={booking._id} className="booking-card">
//                   <p className="booking-field">
//                     <strong>S.No:</strong> {indexOfFirstItem + index + 1}
//                   </p>
//                   <p className="booking-field">
//                     <strong>Booking ID:</strong> {booking._id}
//                   </p>
//                   <p className="booking-field">
//                     <strong>User Email:</strong>{" "}
//                     {booking.customerEmail || "N/A"}
//                   </p>
//                   <p className="booking-field">
//                     <strong>Staffed:</strong>{" "}
//                     {booking.favoriteEmployee || "N/A"}
//                   </p>
//                   <p className="booking-field">
//                     <strong>Service:</strong> {booking.service || "N/A"}
//                   </p>
//                   <p className="booking-field">
//                     <strong>Date & Time:</strong> {booking.date} &{" "}
//                     {booking.time}
//                   </p>
//                   <p className="booking-field">
//                     <strong>Receipt:</strong> {booking.amount || 0}
//                   </p>
//                   <p className="booking-field">
//                     <strong>Balance:</strong>{" "}
//                     {booking.total_amount - (booking.amount || 0)}
//                   </p>
//                   <div className="booking-actions">
//                     <p className="booking-field">
//                       <strong>Report:</strong>{" "}
//                       {booking.spComplaint ? (
//                         <button
//                           onClick={() => handleViewComplaint(booking._id)}
//                           className="action-btn view-btn"
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="#fff"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//                             <circle cx="12" cy="12" r="3" />
//                           </svg>
//                           View
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleComplaintBooking(booking._id)}
//                           className="action

// -btn complain-btn"
//                         >
//                           Complain
//                         </button>
//                       )}
//                     </p>
//                     <p className="booking-field">
//                       <strong>Claim:</strong>{" "}
//                       <button
//                         onClick={() => handleCollectPayment(booking._id)}
//                         disabled={booking.total_amount <= (booking.amount || 0)}
//                         className={`action-btn collect-btn ${
//                           booking.total_amount <= (booking.amount || 0)
//                             ? "disabled"
//                             : ""
//                         }`}
//                       >
//                         {booking.total_amount <= (booking.amount || 0)
//                           ? "Paid"
//                           : "Collect"}
//                       </button>
//                     </p>
//                     <p className="booking-field">
//                       <strong>Confirm:</strong>{" "}
//                       {booking.confirmed === "Confirmed" ? (
//                         <span className="confirmed-text">Confirmed</span>
//                       ) : (
//                         <button
//                           onClick={() => handleConfirmBooking(booking._id)}
//                           disabled={
//                             booking.confirmed === "Confirmed" ||
//                             !isConfirmEnabled(booking)
//                           }
//                           className={`action-btn confirm-btn ${
//                             booking.confirmed === "Confirmed" ||
//                             !isConfirmEnabled(booking)
//                               ? "disabled"
//                               : ""
//                           }`}
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="#fff"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <path d="M20 6L9 17l-5-5" />
//                           </svg>
//                           Accept
//                         </button>
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-bookings">No Bookings Found</div>
//             )}
//           </div>
//         ) : (
//           <div className="table-container">
//             <table className="bookings-table-desktop">
//               <thead>
//                 <tr>
//                   {visibleColumns.map((col) => (
//                     <th key={col} className="table-header">
//                       {col}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.length > 0 ? (
//                   currentItems.map((booking, index) => (
//                     <tr key={booking._id} className="table-row">
//                       {visibleColumns.includes("S.No") && (
//                         <td className="table-cell">
//                           {indexOfFirstItem + index + 1}
//                         </td>
//                       )}
//                       {visibleColumns.includes("Booking ID") && (
//                         <td className="table-cell">{booking._id}</td>
//                       )}
//                       {visibleColumns.includes("User Mail") && (
//                         <td className="table-cell">
//                           {booking.customerEmail || "N/A"}
//                         </td>
//                       )}
//                       {visibleColumns.includes("Staffed") && (
//                         <td className="table-cell">
//                           {booking.favoriteEmployee || "N/A"}
//                         </td>
//                       )}
//                       {visibleColumns.includes("Service") && (
//                         <td className="table-cell">
//                           {booking.service || "N/A"}
//                         </td>
//                       )}
//                       {visibleColumns.includes("Date & Time") && (
//                         <td className="table-cell">
//                           {formatDateTime(booking.date, booking.time)}
//                         </td>
//                       )}
//                       {visibleColumns.includes("Receipt") && (
//                         <td className="table-cell">{booking.amount || 0}</td>
//                       )}
//                       {visibleColumns.includes("Balance") && (
//                         <td className="table-cell">
//                           {booking.total_amount - (booking.amount || 0)}
//                         </td>
//                       )}
//                       {visibleColumns.includes("Report") && (
//                         <td className="table-cell">
//                           {booking.spComplaint ? (
//                             <button
//                               onClick={() => handleViewComplaint(booking._id)}
//                               className="action-btn view-btn"
//                             >
//                               <svg
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="#fff"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               >
//                                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//                                 <circle cx="12" cy="12" r="3" />
//                               </svg>
//                               View
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() =>
//                                 handleComplaintBooking(booking._id)
//                               }
//                               className="action-btn complain-btn"
//                             >
//                               Complain
//                             </button>
//                           )}
//                         </td>
//                       )}
//                       {visibleColumns.includes("Claim") && (
//                         <td className="table-cell">
//                           <button
//                             onClick={() => handleCollectPayment(booking._id)}
//                             disabled={
//                               booking.total_amount <= (booking.amount || 0)
//                             }
//                             className={`action-btn collect-btn ${
//                               booking.total_amount <= (booking.amount || 0)
//                                 ? "disabled"
//                                 : ""
//                             }`}
//                           >
//                             {booking.total_amount <= (booking.amount || 0)
//                               ? "Paid"
//                               : "Collect"}
//                           </button>
//                         </td>
//                       )}
//                       {visibleColumns.includes("Confirm") && (
//                         <td className="table-cell">
//                           {booking.confirmed === "Confirmed" ? (
//                             <span className="confirmed-text">Confirmed</span>
//                           ) : (
//                             <button
//                               onClick={() => handleConfirmBooking(booking._id)}
//                               disabled={
//                                 booking.confirmed === "Confirmed" ||
//                                 !isConfirmEnabled(booking)
//                               }
//                               className={`action-btn confirm-btn ${
//                                 booking.confirmed === "Confirmed" ||
//                                 !isConfirmEnabled(booking)
//                                   ? "disabled"
//                                   : ""
//                               }`}
//                             >
//                               <svg
//                                 width="16"
//                                 height="16"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="#fff"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               >
//                                 <path d="M20 6L9 17l-5-5" />
//                               </svg>
//                               Accept
//                             </button>
//                           )}
//                         </td>
//                       )}
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={visibleColumns.length} className="no-bookings">
//                       No Bookings Found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {filteredBookings.length > itemsPerPage && (
//         <div className="pagination">
//           <button
//             onClick={() => paginate(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="pagination-btn"
//           >
//             Previous
//           </button>
//           <span className="pagination-info">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => paginate(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="pagination-btn"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       <ConfirmationModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         booking={bookings.find((booking) => booking._id === selectedBookingId)}
//         inputId={inputId}
//         setInputId={setInputId}
//         isConfirmed={isConfirmed}
//         setIsConfirmed={setIsConfirmed}
//         error={error}
//         setError={setError}
//         onConfirm={handleConfirmSuccess}
//         isConfirmEnabled={
//           selectedBookingId
//             ? isConfirmEnabled(
//                 bookings.find((booking) => booking._id === selectedBookingId)
//               )
//             : false
//         }
//       />

//       <ComplaintModal
//         isOpen={isComplaintModalOpen}
//         onClose={closeComplaintModal}
//         booking={bookings.find((booking) => booking._id === selectedBookingId)}
//         complaintText={complaintText}
//         setComplaintText={setComplaintText}
//         isSubmitted={isComplaintSubmitted}
//         setIsSubmitted={setIsComplaintSubmitted}
//         error={complaintError}
//         setError={setComplaintError}
//         onSubmit={handleComplaintSuccess}
//       />

//       <ComplaintViewModal
//         isOpen={isComplaintViewModalOpen}
//         onClose={closeComplaintViewModal}
//         booking={bookings.find((booking) => booking._id === selectedBookingId)}
//       />

//       <PaymentModal
//         isOpen={isPaymentModalOpen}
//         onClose={closePaymentModal}
//         booking={bookings.find((booking) => booking._id === selectedBookingId)}
//         paymentAmount={paymentAmount}
//         setPaymentAmount={setPaymentAmount}
//         isPaid={isPaid}
//         setIsPaid={setIsPaid}
//         error={paymentError}
//         setError={setPaymentError}
//         onPayment={handlePaymentSuccess}
//       />
//     </div>
//   );
// };

// export default SpBookingDetails;

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import './SpBookingDetails.css';

const BASE_URL = process.env.REACT_APP_API_URL;

const ConfirmationModal = ({
  isOpen,
  onClose,
  booking,
  inputId,
  setInputId,
  isConfirmed,
  setIsConfirmed,
  error,
  setError,
  onConfirm,
}) => {
  if (!isOpen || !booking) return null;

  const handleSubmit = async () => {
    const userEmail = localStorage.getItem('email');

    // Ensure PIN is provided and is a string
    if (!inputId || inputId.trim() === '') {
      setError('Please enter a PIN.');
      return;
    }

    // Compare PIN (ensure both are strings to avoid type issues)
    if (String(inputId) === String(booking.pin)) {
      try {
        const response = await axios.put(
          `${BASE_URL}/api/users/update-confirmation`,
          {
            email: userEmail,
            bookingId: booking._id,
          }
        );

        setIsConfirmed(true);
        setError('');
        onConfirm(booking._id);
        console.log('Confirmation updated:', response.data);
      } catch (err) {
        console.error('Error updating booking confirmation:', err);
        setError(
          err.response?.data?.message ||
            'Failed to confirm booking. Please try again later.'
        );
      }
    } else {
      setError('Invalid PIN. Please try again.');
    }
  };

  return (
    <div className='modal-backdrop'>
      <div className='confirmation-modal'>
        {!isConfirmed ? (
          <>
            <h3 className='modal-title'>Verify PIN</h3>
            <input
              type='text'
              placeholder='Enter Secret PIN'
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              className={`modal-input ${error ? 'error' : ''}`}
            />
            {error && <p className='error-message'>{error}</p>}
            <div className='modal-actions'>
              <button className='submit-btn' onClick={handleSubmit}>
                Submit
              </button>
              <button className='cancel-btn' onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className='success-icon'>
              <svg
                width='30'
                height='30'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#fff'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M20 6L9 17l-5-5' />
              </svg>
            </div>
            <h3 className='modal-title'>Booking Confirmed!</h3>
            <p className='modal-text'>
              PIN: {booking.pin} verified successfully.
            </p>
            <button className='close-btn' onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ComplaintModal Component
const ComplaintModal = ({
  isOpen,
  onClose,
  booking,
  complaintText,
  setComplaintText,
  isSubmitted,
  setIsSubmitted,
  error,
  setError,
  onSubmit,
}) => {
  if (!isOpen || !booking) return null;

  const handleSubmit = async () => {
    const userEmail = localStorage.getItem('email');

    if (complaintText.trim() === '') {
      setError('Please enter a complaint.');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/submit-complaint`,
        {
          email: userEmail,
          bookingId: booking._id,
          complaint: complaintText,
        }
      );

      setIsSubmitted(true);
      setError('');
      onSubmit(booking._id);
      console.log('Complaint submitted:', response.data);
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError('Failed to submit complaint. Please try again later.');
    }
  };

  return (
    <div className='modal-backdrop'>
      <div className='complaint-modal'>
        {!isSubmitted ? (
          <>
            <h3 className='modal-title'>Submit Complaint</h3>
            <textarea
              placeholder='Describe your complaint...'
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className={`modal-textarea ${error ? 'error' : ''}`}
            />
            {error && <p className='error-message'>{error}</p>}
            <div className='modal-actions'>
              <button className='submit-btn' onClick={handleSubmit}>
                Submit
              </button>
              <button className='cancel-btn' onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className='success-icon'>
              <svg
                width='30'
                height='30'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#fff'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M20 6L9 17l-5-5' />
              </svg>
            </div>
            <h3 className='modal-title'>Complaint Submitted!</h3>
            <button className='close-btn' onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ComplaintViewModal Component
const ComplaintViewModal = ({ isOpen, onClose, booking }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

  return (
    <div className='modal-backdrop'>
      <div className='complaint-view-modal' ref={modalRef}>
        <button className='modal-close-btn' onClick={onClose}>
          ✕
        </button>
        <h3 className='modal-title'>Complaint Details</h3>
        <p className='modal-text'>
          <strong>Booking ID:</strong> {booking._id}
        </p>
        <p className='modal-text'>
          <strong>Service Provider Complaint:</strong>{' '}
          {booking.spComplaint || 'No complaint provided.'}
        </p>
      </div>
    </div>
  );
};

// PaymentModal Component
const PaymentModal = ({
  isOpen,
  onClose,
  booking,
  paymentAmount,
  setPaymentAmount,
  isPaid,
  setIsPaid,
  error,
  setError,
  onPayment,
}) => {
  if (!isOpen || !booking) return null;

  const remainingAmount = booking.total_amount - (booking.amount || 0);

  const handleSubmit = async () => {
    const amountToPay = parseFloat(paymentAmount);

    if (!amountToPay || amountToPay <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    if (amountToPay > remainingAmount) {
      setError(
        `Payment amount cannot exceed remaining amount of ${remainingAmount}.`
      );
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/collect/payment`,
        {
          bookingId: booking._id,
          paymentAmount: amountToPay,
        }
      );

      setIsPaid(true);
      setError('');
      onPayment(booking._id, amountToPay, response.data.paymentStatus);
      console.log('Payment updated:', response.data);
    } catch (err) {
      console.error('Error updating payment:', err);
      setError('Failed to process payment. Please try again later.');
    }
  };

  return (
    <div className='modal-backdrop'>
      <div className='payment-modal'>
        {!isPaid ? (
          <>
            <h3 className='modal-title'>Collect Payment</h3>
            <p className='modal-text'>Remaining Amount: {remainingAmount}</p>
            <input
              type='number'
              placeholder='Enter Payment Amount'
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className={`modal-input ${error ? 'error' : ''}`}
            />
            {error && <p className='error-message'>{error}</p>}
            <div className='modal-actions'>
              <button className='submit-btn' onClick={handleSubmit}>
                Submit
              </button>
              <button className='cancel-btn' onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className='success-icon'>
              <svg
                width='30'
                height='30'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#fff'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M20 6L9 17l-5-5' />
              </svg>
            </div>
            <h3 className='modal-title'>Payment Collected!</h3>
            <p className='modal-text'>Amount {paymentAmount} collected</p>
            <button className='close-btn' onClick={onClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// SpBookingDetails Component
const SpBookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isComplaintViewModalOpen, setIsComplaintViewModalOpen] =
    useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [inputId, setInputId] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isComplaintSubmitted, setIsComplaintSubmitted] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');
  const [complaintError, setComplaintError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    const email = localStorage.getItem('email');
    fetch(`${BASE_URL}/api/users/sp/bookings/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        console.log('Fetched bookings:', data);
      })
      .catch((err) => console.error('Failed to fetch bookings:', err));
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredBookings = [...bookings]
    .reverse()
    .filter((booking) =>
      Object.values(booking).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleConfirmBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setInputId('');
    setIsConfirmed(false);
    setError('');
    setIsModalOpen(true);
  };

  const handleComplaintBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setComplaintText('');
    setIsComplaintSubmitted(false);
    setComplaintError('');
    setIsComplaintModalOpen(true);
  };

  const handleViewComplaint = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsComplaintViewModalOpen(true);
  };

  const handleCollectPayment = (bookingId) => {
    setSelectedBookingId(bookingId);
    setPaymentAmount('');
    setIsPaid(false);
    setPaymentError('');
    setIsPaymentModalOpen(true);
  };

  const handleConfirmSuccess = (bookingId) => {
    setBookings(
      bookings.map((booking) =>
        booking._id === bookingId
          ? { ...booking, confirmed: 'Confirmed' }
          : booking
      )
    );
    setIsConfirmed(true);
  };

  const handleComplaintSuccess = (bookingId) => {
    setBookings(
      bookings.map((booking) =>
        booking._id === bookingId
          ? { ...booking, spComplaint: complaintText }
          : booking
      )
    );
    setIsComplaintSubmitted(true);
  };

  const handlePaymentSuccess = (bookingId, amountPaid, paymentStatus) => {
    setBookings(
      bookings.map((booking) =>
        booking._id === bookingId
          ? {
              ...booking,
              amount: (booking.amount || 0) + amountPaid,
              paymentStatus: paymentStatus,
            }
          : booking
      )
    );
    setIsPaid(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
    setInputId('');
    setIsConfirmed(false);
    setError('');
  };

  const closeComplaintModal = () => {
    setIsComplaintModalOpen(false);
    setSelectedBookingId(null);
    setComplaintText('');
    setIsComplaintSubmitted(false);
    setComplaintError('');
  };

  const closeComplaintViewModal = () => {
    setIsComplaintViewModalOpen(false);
    setSelectedBookingId(null);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedBookingId(null);
    setPaymentAmount('');
    setIsPaid(false);
    setPaymentError('');
  };

  const isMobile = screenWidth <= 768;
  const isVerySmallScreen = screenWidth <= 400;

  const visibleColumns = [
    'S.No',
    'Booking ID',
    'User Mail',
    'Staffed',
    'Service',
    'Date & Time',
    'Receipt',
    'Balance',
    'Report',
    'Claim',
    // 'PIN',
    'Confirm',
  ];

  // Format date and time safely
  const formatDateTime = (date, time) => {
    let dateStr = 'N/A';
    let timeStr = time || 'N/A';

    if (date) {
      try {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
          dateStr = parsedDate.toLocaleDateString();
        }
      } catch (e) {
        console.error('Invalid date format:', date);
      }
    }

    return (
      <td
        dangerouslySetInnerHTML={{
          __html: `${dateStr}${timeStr !== 'N/A' ? `<br>${timeStr}` : ''}`,
        }}
      />
    );
  };

  return (
    <div className='sp-booking-details'>
      <h2 className='page-title'>All Bookings</h2>

      <div className='search-container'>
        <input
          type='text'
          placeholder='Search by any field in bookings...'
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
          className='search-input'
        />
      </div>

      <div className='bookings-table'>
        {isMobile ? (
          <div className='mobile-bookings-list'>
            {currentItems.length > 0 ? (
              currentItems.map((booking, index) => (
                <div key={booking._id} className='booking-card'>
                  <p className='booking-field'>
                    <strong>S.No:</strong> {indexOfFirstItem + index + 1}
                  </p>
                  <p className='booking-field'>
                    <strong>Booking ID:</strong> {booking._id}
                  </p>
                  <p className='booking-field'>
                    <strong>User Email:</strong>{' '}
                    {booking.customerEmail || 'N/A'}
                  </p>
                  <p className='booking-field'>
                    <strong>Staffed:</strong>{' '}
                    {booking.favoriteEmployee || 'N/A'}
                  </p>
                  <p className='booking-field'>
                    <strong>Service:</strong> {booking.pin || 'N/A'}
                  </p>
                  <p className='booking-field'>
                    <strong>Date & Time:</strong>{' '}
                    {formatDateTime(booking.date, booking.time)}
                  </p>
                  <p className='booking-field'>
                    <strong>Receipt:</strong> {booking.amount || 0}
                  </p>
                  <p className='booking-field'>
                    <strong>Balance:</strong>{' '}
                    {booking.total_amount - (booking.amount || 0)}
                  </p>
                  {/* <p className='booking-field'>
                    <strong>PIN:</strong> {booking.pin || 'N/A'}
                  </p> */}
                  <div className='booking-actions'>
                    <p className='booking-field'>
                      <strong>Report:</strong>{' '}
                      {booking.spComplaint ? (
                        <button
                          onClick={() => handleViewComplaint(booking._id)}
                          className='action-btn view-btn'
                        >
                          <svg
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='#fff'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                            <circle cx='12' cy='12' r='3' />
                          </svg>
                          View
                        </button>
                      ) : (
                        <button
                          onClick={() => handleComplaintBooking(booking._id)}
                          className='action-btn complain-btn'
                        >
                          Complain
                        </button>
                      )}
                    </p>
                    <p className='booking-field'>
                      <strong>Claim:</strong>{' '}
                      <button
                        onClick={() => handleCollectPayment(booking._id)}
                        disabled={booking.total_amount <= (booking.amount || 0)}
                        className={`action-btn collect-btn ${
                          booking.total_amount <= (booking.amount || 0)
                            ? 'disabled'
                            : ''
                        }`}
                      >
                        {booking.total_amount <= (booking.amount || 0)
                          ? 'Paid'
                          : 'Collect'}
                      </button>
                    </p>
                    <p className='booking-field'>
                      <strong>Confirm:</strong>{' '}
                      {booking.confirmed === 'Confirmed' ? (
                        <span className='confirmed-text'>Confirmed</span>
                      ) : (
                        <button
                          onClick={() => handleConfirmBooking(booking._id)}
                          disabled={booking.confirmed === 'Confirmed'}
                          className={`action-btn confirm-btn ${
                            booking.confirmed === 'Confirmed' ? 'disabled' : ''
                          }`}
                        >
                          <svg
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='#fff'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path d='M20 6L9 17l-5-5' />
                          </svg>
                          Accept
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className='no-bookings'>No Bookings Found</div>
            )}
          </div>
        ) : (
          <div className='table-container'>
            <table className='bookings-table-desktop'>
              <thead>
                <tr>
                  {visibleColumns.map((col) => (
                    <th key={col} className='table-header'>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((booking, index) => (
                    <tr key={booking._id} className='table-row'>
                      {visibleColumns.includes('S.No') && (
                        <td className='table-cell'>
                          {indexOfFirstItem + index + 1}
                        </td>
                      )}
                      {visibleColumns.includes('Booking ID') && (
                        <td className='table-cell'>{booking._id}</td>
                      )}
                      {visibleColumns.includes('User Mail') && (
                        <td className='table-cell'>
                          {booking.customerEmail || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.includes('Staffed') && (
                        <td className='table-cell'>
                          {booking.favoriteEmployee || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.includes('Service') && (
                        <td className='table-cell'>
                          {booking.service || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.includes('Date & Time') && (
                        <td className='table-cell'>
                          {formatDateTime(booking.date, booking.time)}
                        </td>
                      )}
                      {visibleColumns.includes('Receipt') && (
                        <td className='table-cell'>{booking.amount || 0}</td>
                      )}
                      {visibleColumns.includes('Balance') && (
                        <td className='table-cell'>
                          {booking.total_amount - (booking.amount || 0)}
                        </td>
                      )}
                      {visibleColumns.includes('Report') && (
                        <td className='table-cell'>
                          {booking.spComplaint ? (
                            <button
                              onClick={() => handleViewComplaint(booking._id)}
                              className='action-btn view-btn'
                            >
                              <svg
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='#fff'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              >
                                <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                                <circle cx='12' cy='12' r='3' />
                              </svg>
                              View
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleComplaintBooking(booking._id)
                              }
                              className='action-btn complain-btn'
                            >
                              Complain
                            </button>
                          )}
                        </td>
                      )}
                      {visibleColumns.includes('Claim') && (
                        <td className='table-cell'>
                          <button
                            onClick={() => handleCollectPayment(booking._id)}
                            disabled={
                              booking.total_amount <= (booking.amount || 0)
                            }
                            className={`action-btn collect-btn ${
                              booking.total_amount <= (booking.amount || 0)
                                ? 'disabled'
                                : ''
                            }`}
                          >
                            {booking.total_amount <= (booking.amount || 0)
                              ? 'Paid'
                              : 'Collect'}
                          </button>
                        </td>
                      )}
                      {/* {visibleColumns.includes('PIN') && (
                        <td className='table-cell'>{booking.pin || 'N/A'}</td>
                      )} */}
                      {visibleColumns.includes('Confirm') && (
                        <td className='table-cell'>
                          {booking.confirmed === 'Confirmed' ? (
                            <span className='confirmed-text'>Confirmed</span>
                          ) : (
                            <button
                              onClick={() => handleConfirmBooking(booking._id)}
                              disabled={booking.confirmed === 'Confirmed'}
                              className={`action-btn confirm-btn ${
                                booking.confirmed === 'Confirmed'
                                  ? 'disabled'
                                  : ''
                              }`}
                            >
                              <svg
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='#fff'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              >
                                <path d='M20 6L9 17l-5-5' />
                              </svg>
                              Accept
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={visibleColumns.length} className='no-bookings'>
                      No Bookings Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredBookings.length > itemsPerPage && (
        <div className='pagination'>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className='pagination-btn'
          >
            Previous
          </button>
          <span className='pagination-info'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='pagination-btn'
          >
            Next
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        booking={bookings.find((booking) => booking._id === selectedBookingId)}
        inputId={inputId}
        setInputId={setInputId}
        isConfirmed={isConfirmed}
        setIsConfirmed={setIsConfirmed}
        error={error}
        setError={setError}
        onConfirm={handleConfirmSuccess}
      />

      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={closeComplaintModal}
        booking={bookings.find((booking) => booking._id === selectedBookingId)}
        complaintText={complaintText}
        setComplaintText={setComplaintText}
        isSubmitted={isComplaintSubmitted}
        setIsSubmitted={setIsComplaintSubmitted}
        error={complaintError}
        setError={setComplaintError}
        onSubmit={handleComplaintSuccess}
      />

      <ComplaintViewModal
        isOpen={isComplaintViewModalOpen}
        onClose={closeComplaintViewModal}
        booking={bookings.find((booking) => booking._id === selectedBookingId)}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        booking={bookings.find((booking) => booking._id === selectedBookingId)}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        isPaid={isPaid}
        setIsPaid={setIsPaid}
        error={paymentError}
        setError={setPaymentError}
        onPayment={handlePaymentSuccess}
      />
    </div>
  );
};

export default SpBookingDetails;
