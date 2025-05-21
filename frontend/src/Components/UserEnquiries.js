// frontend/src/components/UserEnquiries.js
"use client";

import { useState, useEffect } from "react";
import { Tooltip, Badge } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const UserEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [supportText, setSupportText] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);
  const itemsPerPage = 5;

  // Fetch enquiries from backend using email
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const email = localStorage.getItem("email"); 
        if (!email) {
          throw new Error("No user email found");
        }
        const response = await axios.get(`${API_BASE_URL}/api/users/userEnquiries`, {
          params: { email },
        });
        setEnquiries(response.data);
        setFilteredEnquiries(response.data);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
        alert("Failed to fetch enquiries. Please ensure you are logged in.");
      }
    };

    fetchEnquiries();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = enquiries;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((enquiry) =>
        [
          enquiry.serviceRequested || "",
          enquiry.shopName || "",
          enquiry.message || "",
        ].some((field) => field.toLowerCase().includes(query))
      );
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
    setCurrentPage

(1);
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
            Responded
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

  const handleContactSupport = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowSupportModal(true);
  };

  const handleSendSupportMessage = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        throw new Error("No user email found");
      }
      await axios.post(`${API_BASE_URL}/api/enquiries/support`, {
        email,
        enquiryId: selectedEnquiry.id,
        message: supportText,
      });
      setShowSupportModal(false);
      setSupportText("");
      setSelectedEnquiry(null);
      alert("Support message sent successfully!");
    } catch (error) {
      console.error("Error sending support message:", error);
      alert("Failed to send support message");
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("");
    setShowFilters(false);
  };

  const totalPages = Math

.ceil(filteredEnquiries.length / itemsPerPage);
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
              <h1 className="fw-bold text-white mb-0">My Enquiries</h1>
              <p className="text-white-50 mt-2 mb-0">
                View and manage your submitted enquiries
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
                    Responded
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
                placeholder="Search by enquiry, shop, or message..."
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
                <option value="approved">Responded</option>
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
                      <th scope="col">Enquiry</th>
                      <th scope="col">response</th>
                      <th scope="col">Shop</th>
                      <th scope="col">Date</th>
                      <th scope="col">Status</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEnquiries.map((enquiry) => (
                      <tr key={enquiry.id}>
                        <td className="align-middle">{enquiry.id}</td>
                        <td className="align-middle">
                          {enquiry.serviceRequested}
                        </td>
                        <td className="align-middle">{enquiry.spMessage}</td>
                        <td className="align-middle">
                         
                          <div className="d-flex flex-column">
            <span className="fw-semibold">{enquiry.shopName}</span>
            <small className="text-muted">{enquiry.shopEmail}</small>
        
          </div>
                          </td>
                        <td className="align-middle">
                          {formatDate(enquiry.dateSubmitted)}
                        </td>
                        <td className="align-middle">
                          {getStatusBadge(enquiry.status)}
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

    
    </div>
  );
};

export default UserEnquiries;