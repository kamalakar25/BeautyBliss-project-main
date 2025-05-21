import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { styled } from "@mui/material/styles";
import debounce from "lodash/debounce";

// Styled FilterToggleButton
const FilterToggleButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("lg")]: {
    display: "block",
    color: "#201548",
    backgroundColor: "transparent",
    border: "2px solid #201548",
    borderRadius: "50%",
    padding: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#201548",
      color: "#ffffff",
      transform: "scale(1.1)",
      boxShadow: "0 4px 12px rgba(32, 21, 72, 0.4)",
    },
  },
}));

// DeleteButton component
const DeleteButton = ({ onClick }) => {
  return (
    <Box
      component="button"
      className="button"
      onClick={onClick}
      sx={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "transparent",
        border: "2px solid #201548",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        overflow: "hidden",
        position: "relative",
        gap: "1px",
        "&:hover": {
          width: "120px",
          borderRadius: "40px",
          background: "linear-gradient(90deg, #201548, #201548)",
          borderColor: "#201548",
          color: "#ffffff",
          transform: "scale(1.05)",
          boxShadow: "0 6px 15px rgba(32, 21, 72, 0.4)",
          "& .svgIcon path": {
            fill: "#ffffff",
          },
          "&:before": {
            opacity: 1,
            transform: "translateY(25px)",
            fontSize: "12px",
          },
        },
        "&:before": {
          position: "absolute",
          top: "-15px",
          content: '"Delete"',
          color: "#ffffff",
          transition: "all 0.3s ease",
          fontSize: "2px",
          opacity: 0,
          fontWeight: "medium",
        },
        "& .svgIcon": {
          width: "12px",
          transition: "all 0.3s ease",
          "& path": {
            fill: "#201548",
          },
        },
        "&:hover .bin-bottom": {
          width: "40px",
          transform: "translateY(60%)",
        },
        "& .bin-top": {
          transformOrigin: "bottom right",
        },
        "&:hover .bin-top": {
          width: "40px",
          transform: "translateY(60%) rotate(160deg)",
        },
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 55 11"
        className="svgIcon bin-top"
      >
        <g clipPath="url(#clip0_35_24)">
          <path
            d="M16.6586 2.10187L15.9958 3.37043C15.8579 3.63447 15.5846 3.8 15.2868 3.8H3.94286C1.76197 3.8 0 5.49813 0 7.6C0 9.70187 1.76197 11.4 3.94286 11.4H51.2571C53.438 11.4 55.2 9.70187 55.2 7.6C55.2 5.49813 53.438 3.8 51.2571 3.8H39.9132C39.6154 3.8 39.3421 3.63447 39.2042 3.37043L38.5414 2.10187C37.8761 0.807504 36.5084 0 34.6175 0H20.1825C18.2916 0 16.9239 0.807504 16.6586 2.10187ZM51.2018 16.0518C51.2318 15.5906 50.8658 15.2 50.4035 15.2H4.79645C4.3342 15.2 3.9682 15.5906 3.99813 16.0518L6.555 55.4562C6.75214 58.4606 9.33968 60.8 12.457 60.8H42.743C45.8603 60.8 48.4479 58.4606 48.645 55.4562L51.2018 16.0518Z"
          ></path>
        </g>
        <defs>
          <clipPath id="clip0_35_24">
            <rect fill="white" height="11" width="55"></rect>
          </clipPath>
        </defs>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 55 46"
        className="svgIcon bin-bottom"
      >
        <g clipPath="url(#clip0_35_22)">
          <path
            d="M16.6586 -13.0981L15.9958 -11.8296C15.8579 -11.5655 15.5846 -11.4 15.2868 -11.4H3.94286C1.76197 -11.4 0 -9.70187 0 -7.6C0 -5.49813 1.76197 -3.8 3.94286 -3.8H51.2571C53.438 -3.8 55.2 -5.49813 55.2 -7.6C55.2 -9.70187 53.438 -11.4 51.2571 -11.4H39.9132C39.6154 -11.4 39.3421 -11.5655 39.2042 -11.8296L38.5414 -13.0981C37.8761 -14.3925 36.5084 -15.2 34.6175 -15.2H20.1825C18.2916 -15.2 16.9239 -14.3925 16.6586 -13.0981ZM51.2018 0.85184C51.2318 0.39056 50.8658 0 50.4035 0H4.79645C4.3342 0 3.9682 0.39056 3.99813 0.85184L6.555 40.2562C6.75214 43.2606 9.33968 45.6 12.457 45.6H42.743C45.8603 45.6 48.4479 43.2606 48.645 40.2562L51.2018 0.85184Z"
          ></path>
        </g>
        <defs>
          <clipPath id="clip0_35_22">
            <rect fill="white" height="46" width="55"></rect>
          </clipPath>
        </defs>
      </svg>
    </Box>
  );
};

// Function to parse latitude and longitude from location string
const parseCoordinates = (location) => {
  if (!location || typeof location !== "string") {
    return { latitude: null, longitude: null };
  }
  try {
    const latMatch = location.match(/Lat: ([\d.-]+)/);
    const lonMatch = location.match(/Lon: ([\d.-]+)/);
    const latitude = latMatch ? parseFloat(latMatch[1]) : null;
    const longitude = lonMatch ? parseFloat(lonMatch[1]) : null;
    return { latitude, longitude };
  } catch (error) {
    return { latitude: null, longitude: null };
  }
};

// Function to get Google Maps link
const getMapLink = (location) => {
  const { latitude, longitude } = parseCoordinates(location);
  const lat = latitude !== null ? latitude : 17.359699; // Default latitude
  const lon = longitude !== null ? longitude : 78.534277; // Default longitude
  return `https://www.google.com/maps?q=${lat},${lon}`;
};

const ServiceProviderDetails = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addresses, setAddresses] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");
  const itemsPerPage = 5;

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        console.log("Fetching from:", `${BASE_URL}/api/main/admin/get/all/service-providers`);
        const response = await axios.get(
          `${BASE_URL}/api/main/admin/get/all/service-providers`
        );
        console.log("API response:", response.data);

        if (!Array.isArray(response.data) || response.data.length === 0) {
          setError("No service providers found in the database.");
          setServiceProviders([]);
          setFilteredProviders([]);
          return;
        }

        // Normalize data to ensure all expected fields are present
        const normalizedProviders = response.data.map((provider) => ({
          _id: provider._id || "",
          name: provider.name || "N/A",
          email: provider.email || "N/A",
          phone: provider.phone || "N/A",
          shopName: provider.shopName || "N/A",
          designation: provider.designation || "N/A",
          location: provider.location || "N/A",
          spAddress: provider.spAddress || "N/A",
          createdAt: provider.createdAt || null,
          priority: provider.priority !== undefined ? parseInt(provider.priority) : 0,
        }));

        console.log("Normalized providers:", normalizedProviders);
        setServiceProviders(normalizedProviders.reverse());
        setFilteredProviders(normalizedProviders);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(
          error.response
            ? `Failed to load service providers: ${error.response.data.message || error.message}`
            : "Failed to connect to the server. Please check your network or server status."
        );
        setServiceProviders([]);
        setFilteredProviders([]);
      }
    };
    fetchServiceProviders();
  }, []);

  useEffect(() => {
    let filtered = [...serviceProviders];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((provider) => {
        const fieldsToSearch = [
          provider.name,
          provider.email,
          provider.phone,
          provider.shopName,
          provider.designation,
          provider.location,
          provider.spAddress,
          formatDate(provider.createdAt),
          String(provider.priority),
        ];
        return fieldsToSearch.some((field) =>
          field.toLowerCase().includes(query)
        );
      });
    }

    if (startDateFilter || endDateFilter) {
      filtered = filtered.filter((provider) => {
        if (!provider.createdAt) return false;
        try {
          const joinDate = new Date(provider.createdAt);
          if (isNaN(joinDate.getTime())) return false;
          const startDate = startDateFilter ? new Date(startDateFilter) : null;
          const endDate = endDateFilter ? new Date(endDateFilter) : null;
          if (endDate) endDate.setHours(23, 59, 59, 999);
          if (startDate && endDate) {
            return joinDate >= startDate && joinDate <= endDate;
          } else if (startDate) {
            return joinDate >= startDate;
          } else if (endDate) {
            return joinDate <= endDate;
          }
          return true;
        } catch (error) {
          return false;
        }
      });
    }

    console.log("Filtered providers:", filtered);
    setFilteredProviders(filtered);
    setCurrentPage(1);
  }, [searchQuery, startDateFilter, endDateFilter, serviceProviders]);

  // Debounced API call for priority update
  const updatePriorityAPI = useCallback(
    debounce(async (providerId, newPriority) => {
      try {
        const response = await axios.put(
          `${BASE_URL}/api/main/admin/update-priority/${providerId}`,
          { priority: newPriority },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Priority update response:", response.data);
        // Refetch service providers to ensure UI is in sync with backend
        const fetchResponse = await axios.get(
          `${BASE_URL}/api/main/admin/get/all/service-providers`
        );
        const normalizedProviders = fetchResponse.data.map((provider) => ({
          _id: provider._id || "",
          name: provider.name || "N/A",
          email: provider.email || "N/A",
          phone: provider.phone || "N/A",
          shopName: provider.shopName || "N/A",
          designation: provider.designation || "N/A",
          location: provider.location || "N/A",
          spAddress: provider.spAddress || "N/A",
          createdAt: provider.createdAt || null,
          priority: provider.priority !== undefined ? parseInt(provider.priority) : 0,
        }));
        setServiceProviders(normalizedProviders.reverse());
        setFilteredProviders(normalizedProviders);
        alert("Priority updated successfully.");
      } catch (error) {
        console.error("Priority update error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          providerId,
          newPriority,
        });
        setError(
          error.response?.data?.message
            ? `Failed to update priority: ${error.response.data.message}`
            : error.response
            ? `Failed to update priority: ${error.response.status} - ${
                error.response.data?.error || "Shop not found"
              }`
            : "Failed to update priority. Please check your network or server status."
        );
        // Revert optimistic update on failure
        setServiceProviders((prev) =>
          prev.map((provider) =>
            provider._id === providerId
              ? { ...provider, priority: provider.priority }
              : provider
          )
        );
        setFilteredProviders((prev) =>
          prev.map((provider) =>
            provider._id === providerId
              ? { ...provider, priority: provider.priority }
              : provider
          )
        );
      }
    }, 500),
    []
  );

  const handlePriorityChange = (providerId, value) => {
    // Convert input to number, default to 0 if empty or invalid
    const newPriority = value === "" ? 0 : parseInt(value);
    if (isNaN(newPriority) || newPriority < 0) {
      setError("Priority must be a non-negative number.");
      return;
    }

    // Optimistic UI update
    setServiceProviders((prev) =>
      prev.map((provider) =>
        provider._id === providerId
          ? { ...provider, priority: newPriority }
          : provider
      )
    );
    setFilteredProviders((prev) =>
      prev.map((provider) =>
        provider._id === providerId
          ? { ...provider, priority: newPriority }
          : provider
      )
    );

    // Trigger debounced API update
    updatePriorityAPI(providerId, newPriority);
  };

  const handleDelete = async () => {
    if (providerToDelete) {
      try {
        await axios.delete(
          `${BASE_URL}/api/main/admin/delete/${providerToDelete}`
        );
        setServiceProviders(
          serviceProviders.filter(
            (provider) => provider._id !== providerToDelete
          )
        );
        setFilteredProviders(
          filteredProviders.filter(
            (provider) => provider._id !== providerToDelete
          )
        );
        setShowModal(false);
        setProviderToDelete(null);
        alert("Service provider deleted successfully.");
      } catch (error) {
        console.error("Delete error:", error);
        setError(
          error.response
            ? `Failed to delete service provider: ${error.response.data.message}`
            : "Failed to delete service provider. Please try again."
        );
      }
    }
  };

  const openDeleteModal = (providerId) => {
    setProviderToDelete(providerId);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setProviderToDelete(null);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeDeleteModal();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "Invalid Date";
    }
  };

  const clearAllFilters = () => {
    setStartDateFilter("");
    setEndDateFilter("");
    setSearchQuery("");
    setShowFilters(false);
  };

  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const paginatedProviders = filteredProviders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: "20px 10px", sm: "30px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          p: "24px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
          margin: "0 auto",
          transition: "all 0.3s ease",
          animation: "fadeIn 0.5s ease-out",
          "@keyframes fadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          "&:hover": {
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: "24px",
            gap: "16px",
          }}
        >
          <Box
            component="h2"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2rem" },
              color: "#0e0f0f",
              fontWeight: "bold",
              m: 0,
              textAlign: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#201548",
                textShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
              },
            }}
          >
            Service Provider Details
          </Box>
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row", lg: "row" },
                flexWrap: { sm: "wrap" },
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: 2, sm: 3 },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: { xs: "flex", lg: "none" },
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                  maxWidth: { xs: "100%", sm: "400px" },
                }}
              >
                <Box
                  component="input"
                  type="text"
                  placeholder="Search by name, email, or priority..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    p: "10px",
                    borderRadius: "8px",
                    border: "2px solid #201548",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(4px)",
                    fontSize: "0.95rem",
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "200px" },
                    color: "#0e0f0f",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:focus": {
                      borderColor: "#201548",
                      boxShadow: "0 0 10px rgba(32, 21, 72, 0.3)",
                      backgroundColor: "#ffffff",
                    },
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                    },
                  }}
                />
                <FilterToggleButton onClick={handleToggleFilters} style={{ borderRadius: "20px" }}>
                  <FilterListIcon />
                </FilterToggleButton>
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: "1.1rem",
                  color: "#0e0f0f",
                  mt: { xs: 0, sm: "20px" },
                  textAlign: "center",
                  fontWeight: "medium",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#201548",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Total Service Providers: <strong>{filteredProviders.length}</strong>
              </Box>
              <Box
                sx={{
                  display: { xs: showFilters ? "flex" : "none", lg: "flex" },
                  flexDirection: { xs: "column", sm: "row" },
                  flexWrap: { sm: "wrap" },
                  justifyContent: "center",
                  alignItems: "center",
                  gap: { xs: 2, sm: 3 },
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: { xs: "100%", sm: "auto" },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: { xs: "50%", sm: "auto" },
                    }}
                  >
                    <Box
                      component="label"
                      htmlFor="startDate"
                      sx={{
                        fontSize: "0.95rem",
                        color: "#0e0f0f",
                        mb: "6px",
                        zIndex: 3,
                        fontWeight: "medium",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          color: "#201548",
                        },
                      }}
                    >
                      From
                    </Box>
                    <Box
                      component="input"
                      id="startDate"
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      sx={{
                        p: "10px",
                        borderRadius: "8px",
                        border: "2px solid #201548",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        fontSize: "0.95rem",
                        width: "100%",
                        maxWidth: { xs: "150px", sm: "200px" },
                        textAlign: "center",
                        color: "#0e0f0f",
                        transition: "all 0.3s ease",
                        "&:focus": {
                          borderColor: "#201548",
                          boxShadow: "0 0 10px rgba(32, 21, 72, 0.3)",
                          backgroundColor: "#ffffff",
                        },
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: { xs: "50%", sm: "auto" },
                    }}
                  >
                    <Box
                      component="label"
                      htmlFor="endDate"
                      sx={{
                        fontSize: "0.95rem",
                        color: "#0e0f0f",
                        mb: "6px",
                        fontWeight: "medium",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          color: "#201548",
                        },
                      }}
                    >
                      To
                    </Box>
                    <Box
                      component="input"
                      id="endDate"
                      type="date"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      min={startDateFilter || undefined}
                      max={new Date().toISOString().split("T")[0]}
                      sx={{
                        p: "10px",
                        borderRadius: "8px",
                        border: "2px solid #201548",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        fontSize: "0.95rem",
                        width: "100%",
                        maxWidth: { xs: "150px", sm: "200px" },
                        textAlign: "center",
                        color: "#0e0f0f",
                        transition: "all 0.3s ease",
                        "&:focus": {
                          borderColor: "#201548",
                          boxShadow: "0 0 10px rgba(32, 21, 72, 0.3)",
                          backgroundColor: "#ffffff",
                        },
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  component="button"
                  onClick={clearAllFilters}
                  disabled={!searchQuery && !startDateFilter && !endDateFilter}
                  sx={{
                    p: "10px 20px",
                    borderRadius: "8px",
                    border: "2px solid #201548",
                    background: "#201548",
                    fontSize: "0.95rem",
                    fontWeight: "medium",
                    color: "#fff",
                    marginTop: "30px !important",
                    cursor:
                      !searchQuery && !startDateFilter && !endDateFilter
                        ? "not-allowed"
                        : "pointer",
                    mt: { xs: 0, sm: "20px" },
                    transition: "all 0.3s ease",
                    "&:hover": {
                      ...(searchQuery || startDateFilter || endDateFilter
                        ? {
                            background: "linear-gradient(90deg, #201548, #201548)",
                            color: "#ffffff",
                            transform: "scale(1.05)",
                            boxShadow: "0 4px 12px rgba(32, 21, 72, 0.3)",
                          }
                        : {}),
                    },
                  }}
                >
                  Clear Filters
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {error && (
          <Box
            sx={{
              color: "#201548",
              fontSize: "0.95rem",
              textAlign: "center",
              mb: 2,
              fontWeight: "medium",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#201548",
              },
            }}
          >
            {error}
          </Box>
        )}
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "transparent",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              component="thead"
              sx={{
                background: "linear-gradient(90deg, #201548, #201548)",
                color: "#ffffff",
              }}
            >
              <tr>
                {[
                  "Sl. No",
                  "Name",
                  "Email",
                  "Shop Name",
                  "Phone",
                  "Designation",
                  "Address",
                  "Date of Join",
                  "Priority",
                  "Actions",
                ].map((header, idx) => (
                  <Box
                    component="th"
                    key={idx}
                    sx={{
                      p: "14px",
                      textAlign: "center",
                      fontSize: "1rem",
                      fontWeight: "medium",
                      border: "1px solid #e2e8f0",
                      ...(header === "Actions" ? { width: "150px" } : {}),
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "#201548",
                        boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                      },
                    }}
                  >
                    {header}
                  </Box>
                ))}
              </tr>
            </Box>
            <Box component="tbody">
              {paginatedProviders.map((provider, index) => {
                const { latitude, longitude } = parseCoordinates(
                  provider.location
                );
                const displayLocation =
                  provider.spAddress ||
                  (latitude && longitude
                    ? `${latitude}, ${longitude}`
                    : provider.location || "N/A");
                return (
                  <tr
                    key={provider._id}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <Box
                      component="td"
                      sx={{
                        p: "14px",
                        fontSize: "0.95rem",
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        color: "#0e0f0f",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    >
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "14px",
                        fontSize: "0.95rem",
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        color: "#0e0f0f",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    >
                      {provider.name}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "14px",
                        fontSize: "0.95rem",
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        color: "#0e0f0f",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    >
                      {provider.email}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "14px",
                        fontSize: "0.95rem",
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        color: "#0e0f0f",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    >
                      {provider.shopName}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "14px",
                        fontSize: "0.95rem",
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        color: "#0e0f0f",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    >
                      {provider.phone}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "14px",
                        fontSize: "0.95rem",
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        color: "#0e0f0f",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    >
                      {provider.designation}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "8px",
                        fontSize: "0.95rem",
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        color: "#0e0f0f",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    >
                      {latitude && longitude ? (
                        <a
                          href={getMapLink(provider.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            marginBottom: "4px",
                            color: "#201548",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="24"
                            height="24"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="#1c9957"
                              d="M42,39V9c0-1.657-1.343-3-3-3H9C7.343,6,6,7.343,6,9v30c0,1.657,1.343,3,3,3h30C40.657,42,42,40.657,42,39z"
                            ></path>
                            <path
                              fill="#3e7bf1"
                              d="M9,42h30c1.657,0-15-16-15-16S7.343,42,9,42z"
                            ></path>
                            <path
                              fill="#cbccc9"
                              d="M42,39V9c0-1.657-16,15-16,15S42,40.657,42,39z"
                            ></path>
                            <path
                              fill="#ffffff"
                              d="M39,42c1.657,0,3-1.343,3-3v-0.245L26.245,23L23,26.245L38.755,42H39z"
                            ></path>
                            <path
                              fill="#ffd73d"
                              d="M42,9c0-1.657-1.343-3-3-3h-0.245L6,38.755V39c0,1.657,1.343,3,3,3h0.245L42,9.245V9z"
                            ></path>
                            <path
                              fill="#d73f35"
                              d="M36,2c-5.523,0-10,4.477-10,10c0,6.813,7.666,9.295,9.333,19.851C35.44,32.531,35.448,33,36,33s0.56-0.469,0.667-1.149C38.334,21.295,46,18.813,46,12C46,6.477,41.523,2,36,2z"
                            ></path>
                            <path
                              fill="#752622"
                              d="M36 8.5A3.5 3.5 0 1 0 36 15.5A3.5 3.5 0 1 0 36 8.5Z"
                            ></path>
                          </svg>
                        </a>
                      ) : (
                        displayLocation
                      )}
                      {provider.spAddress !== "N/A" && (
                        <Box
                          sx={{
                            maxHeight: "40px",
                            overflowY: "auto",
                            mt: 1,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            fontSize: "0.8rem",
                            color: "#0e0f0f",
                          }}
                        >
                          {provider.spAddress}
                        </Box>
                      )}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "14px",
                        fontSize: "0.95rem",
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        color: "#0e0f0f",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    >
                      {formatDate(provider.createdAt)}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "14px",
                        fontSize: "0.95rem",
                        textAlign: "center",
                        border: "1px solid #e2e8f0",
                        color: "#0e0f0f",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                        },
                      }}
                    >
                      <Box
                        component="input"
                        type="number"
                        min="0"
                        value={provider.priority}
                        onChange={(e) => handlePriorityChange(provider._id, e.target.value)}
                        sx={{
                          width: "60px",
                          p: "5px",
                          borderRadius: "4px",
                          border: "1px solid #201548",
                          textAlign: "center",
                          fontSize: "0.9rem",
                          "&:focus": {
                            borderColor: "#201548",
                            boxShadow: "0 0 5px rgba(32, 21, 72, 0.3)",
                            outline: "none",
                          },
                          "&:hover": {
                            borderColor: "#201548",
                          },
                        }}
                      />
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "14px",
                        textAlign: "center",
                        width: "150px",
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: "transparent",
                      }}
                    >
                      <DeleteButton
                        onClick={() => openDeleteModal(provider._id)}
                      />
                    </Box>
                  </tr>
                );
              })}
              {filteredProviders.length === 0 && (
                <tr>
                  <Box
                    component="td"
                    colSpan="10"
                    sx={{
                      textAlign: "center",
                      p: "20px",
                      color: "#0e0f0f",
                      fontSize: "1rem",
                      fontWeight: "medium",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(4px)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                      },
                    }}
                  >
                    No service providers found.
                  </Box>
                </tr>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <Box
            component="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            sx={{
              p: "10px 20px",
              borderRadius: "8px",
              border: "2px solid #201548",
              background: "#201548",
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: "medium",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                ...(currentPage !== 1
                  ? {
                      background: "linear-gradient(90deg, #201548, #201548)",
                      color: "#ffffff",
                      transform: "scale(1.05)",
                      boxShadow: "0 4px 12px rgba(32, 21, 72, 0.3)",
                    }
                  : {}),
              },
            }}
          >
            Previous
          </Box>
          <Box
            component="span"
            sx={{
              fontSize: "0.95rem",
              color: "#0e0f0f",
              fontWeight: "medium",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#201548",
                transform: "scale(1.05)",
              },
            }}
          >
            Page {currentPage} of {totalPages}
          </Box>
          <Box
            component="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            sx={{
              p: "10px 20px",
              borderRadius: "8px",
              border: "2px solid #201548",
              background: "#201548",
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: "medium",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                ...(currentPage !== totalPages
                  ? {
                      background: "linear-gradient(90deg, #201548, #201548)",
                      color: "#ffffff",
                      transform: "scale(1.05)",
                      boxShadow: "0 4px 12px rgba(32, 21, 72, 0.3)",
                    }
                  : {}),
              },
            }}
          >
            Next
          </Box>
        </Box>
      </Box>

      {showModal && (
        <Box
          onClick={handleBackdropClick}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeInModal 0.4s ease",
            "@keyframes fadeInModal": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          <Box
            sx={{
              width: { xs: "90%", sm: "400px", md: "450px" },
              maxWidth: "450px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
              borderRadius: "12px",
              p: { xs: 3, sm: 4 },
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 10px 28px rgba(0, 0, 0, 0.25)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textDecoration: "none",
                mb: 3,
                "&:hover .delete-icon": {
                  color: "#201548",
                  transition: "color 0.3s ease",
                },
              }}
            >
              <DeleteIcon
                className="delete-icon"
                sx={{
                  fontSize: { xs: 48, sm: 56 },
                  color: "#201548",
                }}
              />
            </Box>
            <Box
              component="h2"
              sx={{
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                fontWeight: "bold",
                color: "#0e0f0f",
                mb: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#201548",
                  textShadow: "0 2px 8px rgba(32, 21, 72, 0.2)",
                },
              }}
            >
              Are You Sure?
            </Box>
            <Box
              component="p"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                color: "#0e0f0f",
                mb: 4,
                px: { xs: 2, sm: 0 },
                fontWeight: "medium",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#201548",
                },
              }}
            >
              Do you really want to delete this service provider? This process
              cannot be undone.
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Box
                component="button"
                onClick={closeDeleteModal}
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 auto" },
                  background: "linear-gradient(90deg, #ffffff, #e2e8f0)",
                  color: "#0e0f0f",
                  px: 4,
                  py: 1.5,
                  fontSize: "0.95rem",
                  fontWeight: "medium",
                  borderRadius: "8px",
                  border: "2px solid #201548",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(90deg, #201548, #201548)",
                    color: "#ffffff",
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 12px rgba(32, 21, 72, 0.3)",
                  },
                }}
              >
                Cancel
              </Box>
              <Box
                component="button"
                onClick={handleDelete}
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 auto" },
                  background: "linear-gradient(90deg, #201548, #201548)",
                  color: "#ffffff",
                  px: 4,
                  py: 1.5,
                  fontSize: "0.95rem",
                  fontWeight: "medium",
                  borderRadius: "8px",
                  border: "2px solid #201548",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(90deg, #201548, #201548)",
                    borderColor: "#201548",
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 12px rgba(32, 21, 72, 0.3)",
                  },
                }}
              >
                Confirm
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ServiceProviderDetails;
