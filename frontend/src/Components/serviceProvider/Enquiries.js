"use client";

import { useState, useEffect } from "react";
import { Tooltip, Badge } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import { motion } from "framer-motion";
import axios from "axios"; // Import Axios
import "./Enquiries.css"; // Import your CSS file for styling

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const itemsPerPage = 5;


  // Base URL for API (adjust if your backend is hosted elsewhere)
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch enquiries from backend using Axios
  useEffect(() => {
    const fetchEnquiries = async () => {
        const parlorEmail =localStorage.getItem("email");
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/enquiries/${parlorEmail}`);
        setEnquiries(response.data);
        setFilteredEnquiries(response.data);
        console.log("Enquiries fetched:", response.data);
        
      } catch (error) {
        console.error("Error fetching enquiries:", error.response?.data || error.message);
        alert("Failed to load enquiries. Please try again later.");
      }
    };

    fetchEnquiries();
  }, []);

  // Filter enquiries based on search, status, and date
  useEffect(() => {
    let filtered = enquiries;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((enquiry) => {
        const fieldsToSearch = [
          enquiry.customerName || "",
          enquiry.customerEmail || "",
          enquiry.customerPhone || "",
          enquiry.userMessage || "",
          enquiry.serviceRequested || "",
          enquiry.shopName || "",
        ];
        return fieldsToSearch.some((field) =>
          field.toLowerCase().includes(query)
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((enquiry) => enquiry.status === statusFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((enquiry) => {
        const enquiryDate = new Date(enquiry.dateSubmitted);
        return (
          enquiryDate.getFullYear() === filterDate.getFullYear() &&
          enquiryDate.getMonth() === filterDate.getMonth() &&
          enquiryDate.getDate() === filterDate.getDate()
        );
      });
    }

    setFilteredEnquiries(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter, enquiries]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      return new Intl.DateTimeFormat("en-IN", options).format(date);
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return (
          <span className="badge bg-danger px-3 py-2 rounded-pill">New</span>
        );
      case "approved":
        return (
          <span className="badge bg-warning px-3 py-2 rounded-pill">
            Approved
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary px-3 py-2 rounded-pill">
            Unknown
          </span>
        );
    }
  };

  const handleReply = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {

    
    try {
      await axios.put(`${API_BASE_URL}/api/users/enquiries/${selectedEnquiry.id}`, {
        status: "approved",
        spMessage: replyText,
      });

      // Update local state
      const updatedEnquiries = enquiries.map((enq) =>
        enq.id === selectedEnquiry.id
          ? { ...enq, status: "approved" }
          : enq
      );

      setEnquiries(updatedEnquiries);
      setFilteredEnquiries(updatedEnquiries);
      setShowReplyModal(false);
      setReplyText("");
      setSelectedEnquiry(null);

      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error.response?.data || error.message);
      alert("Failed to send reply. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
        
        
      try {
        await axios.delete(`${API_BASE_URL}/api/users/enquiries/${id}`);

        const updatedEnquiries = enquiries.filter((enq) => enq.id !== id);
        setEnquiries(updatedEnquiries);
        setFilteredEnquiries(updatedEnquiries);
      } catch (error) {
        console.error("Error deleting enquiry:", error.response?.data || error.message);
        alert("Failed to delete enquiry. Please try again.");
      }
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("");
    setShowFilters(false);
  };

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        color: "#0e0f0f",
      }}
    >
      {/* Header Section */}
      <div
        className="container-fluid py-4 mb-4"
        style={{
          backgroundColor: "#201548",
          borderBottom: "5px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <h1 className="fw-bold text-white mb-0">Service Enquiries</h1>
              <p className="text-white-50 mt-2 mb-0">
                Manage and respond to customer enquiries
              </p>
            </div>
            <div className="col-md-6 d-flex justify-content-center justify-content-md-end mt-3 mt-md-0">
              <div className="d-flex gap-4">
                <Badge
                  badgeContent={
                    filteredEnquiries.filter((e) => e.status === "new").length
                  }
                  color="error"
                >
                  <button
                    className={`btn ${
                      statusFilter === "new"
                        ? "btn-danger"
                        : "btn-outline-light"
                    }`}
                    onClick={() =>
                      setStatusFilter(statusFilter === "new" ? "all" : "new")
                    }
                  >
                    New
                  </button>
                </Badge>
                <Badge
                  badgeContent={
                    filteredEnquiries.filter((e) => e.status === "approved")
                      .length
                  }
                  color="warning"
                >
                  <button
                    className={`btn ${
                      statusFilter === "approved"
                        ? "btn-warning"
                        : "btn-outline-light"
                    }`}
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === "approved" ? "all" : "approved"
                      )
                    }
                  >
                    Approved
                  </button>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mb-5">
        {/* Search and Filter Section */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <SearchIcon style={{ color: "#201548" }} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name, email, enquiry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end">
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterListIcon className="me-1" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              {(searchQuery || statusFilter !== "all" || dateFilter) && (
                <button
                  className="btn btn-outline-danger"
                  onClick={clearAllFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <motion.div
            className="row mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="col-md-4 mb-3 mb-md-0">
              <label className="form-label">Filter by Date</label>
              <input
                type="date"
                className="form-control"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <label className="form-label">Filter by Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Enquiries List */}
        <div className="row">
          <div className="col-12">
            {paginatedEnquiries.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <img
                    src="/placeholder.svg?height=120&width=120"
                    alt="No enquiries"
                    style={{ opacity: 0.5 }}
                  />
                </div>
                <h4 className="text-muted">No enquiries found</h4>
                <p className="text-muted">
                  Try adjusting your search or filter criteria
                </p>
                {(searchQuery || statusFilter !== "all" || dateFilter) && (
                  <button
                    className="btn btn-outline-primary mt-2"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="table-responsive">
               <table className="table table-hover border">
  <thead className="table-light">
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Customer</th>
      <th scope="col">Enquiry</th>
      <th scope="col">Date</th>
      <th scope="col">Status</th>
      <th scope="col" className="text-end">
        Actions
      </th>
    </tr>
  </thead>
  <tbody>
    {paginatedEnquiries.map((enquiry) => (
      <tr key={enquiry.id}>
        <td className="align-middle">{enquiry.id}</td>
        <td className="align-middle">
          <div className="d-flex flex-column">
            <span className="fw-semibold">{enquiry.customerName}</span>
            <small className="text-muted">{enquiry.customerEmail}</small>
            <small className="text-muted">{enquiry.customerPhone}</small>
          </div>
        </td>
        <td className="align-middle">
          <div
            className="d-flex flex-column"
            style={{
              maxWidth: "200px", // Adjust width as needed
              whiteSpace: "normal", // Allow text to wrap
              wordBreak: "break-word", // Break long words
              overflow: "hidden", // Hide overflow
              textOverflow: "ellipsis", // Optional: Add ellipsis for overflow
            }}
          >
            <span>{enquiry.message}</span>
          </div>
        </td>
        <td className="align-middle">{formatDate(enquiry.dateSubmitted)}</td>
        <td className="align-middle">{getStatusBadge(enquiry.status)}</td>
        <td className="align-middle text-end">
          <div className="btn-group">
            {enquiry.status === "new" && (
              <Tooltip title="Reply">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleReply(enquiry)}
                >
                  <ReplyIcon fontSize="small" />
                </button>
              </Tooltip>
            )}
            <Tooltip title="Delete">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(enquiry.id)}
              >
                <DeleteIcon fontSize="small" />
              </button>
            </Tooltip>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="pagination d-flex justify-content-center align-items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="pagination-info mx-3">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedEnquiry && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <motion.div
            className="bg-white rounded-4 shadow-lg p-4 mx-3"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="m-0" style={{ color: "#201548" }}>
                Reply to Enquiry
              </h3>
              <button
                className="btn border-0"
                onClick={() => setShowReplyModal(false)}
                style={{ color: "#201548" }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="mb-4">
              <h5>Customer Information</h5>
              <p className="mb-1">
                <strong>Name:</strong> {selectedEnquiry.customerName}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {selectedEnquiry.customerEmail}
              </p>
              
              <p className="mb-1">
                <strong>Phone:</strong> {selectedEnquiry.customerPhone}
              </p>
            </div>

            <div className="mb-4">
              <h5>Original Message</h5>
              <div className="p-3 bg-light rounded mb-3">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="replyMessage" className="form-label fw-semibold">
                Your Reply
              </label>
              <textarea
                id="replyMessage"
                className="form-control"
                rows="5"
                placeholder="Type your response here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>
            </div>

            <div className="d-flex gap-3 justify-content-end">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowReplyModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{
                  backgroundColor: "#201548",
                  color: "white",
                }}
                onClick={handleSendReply}
                disabled={!replyText.trim()}
              >
                <MarkEmailReadIcon className="me-1" /> Send Reply
              </button>
            </div>
          </motion.div>
        </div>
      )}

    
    </div>
  );
};

export default Enquiries;