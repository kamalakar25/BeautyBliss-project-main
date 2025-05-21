import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import "./serviceProvide.css";

const BASE_URL = process.env.REACT_APP_API_URL;

const SuccessMessage = ({ message, onClose, screenWidth }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isAddService = message.toLowerCase().includes("added");

  return createPortal(
    <>
      <div className="success-backdrop" />
      <div
        className={`success-modal ${
          isAddService ? "add-animation" : "update-animation"
        }`}
        style={{
          width: screenWidth <= 768 ? "85%" : "20rem",
          maxWidth: "22rem",
        }}
      >
        <div className="success-content">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`particle ${
                isAddService ? "particle-add" : "particle-update"
              }`}
              style={{ animationDelay: `${i * 0.04}s` }}
            />
          ))}
          <div
            className={`success-icon ${
              isAddService ? "pulse-add" : "pulse-update"
            }`}
          >
            <div className="success-inner-circle" />
            <div className="success-tick-container">
              <div className="tick-short" />
              <div className="tick-long" />
            </div>
          </div>
          <h4 className="success-title">{message}</h4>
          <p className="success-subtitle">Success!</p>
        </div>
        <div className="success-footer">
          <button className="success-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showTooltip, setShowTooltip] = useState({});
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [role, setRole] = useState("");
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showDustbin, setShowDustbin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const servicesPerPage = 4;
  const itemRefs = useRef({});
  const svgIconRef = useRef(null);

  const [formData, setFormData] = useState({
    serviceName: "",
    style: "",
    price: "",
    duration: "",
    imageFile: null,
    imagePreview: "",
  });

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getRole = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await axios.get(`${BASE_URL}/api/users/role/${email}`);
        setRole(response.data.role);
      } catch (error) {
        console.error("ServicePage: Error fetching role:", error.message);
      }
    };
    getRole();
  }, []);

  const fetchServices = async () => {
    const userEmail = localStorage.getItem("email");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/get-services/${userEmail}`
      );
      setServices(response.data.reverse());
    } catch (error) {
      console.error("ServicePage: Error fetching services:", error.message);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));

    // Real-time validation
    if (name === "serviceName") {
      if (!value) {
        setFormErrors((prev) => ({
          ...prev,
          serviceName: "Service name is required",
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, serviceName: "" }));
      }
    } else if (name === "price") {
      if (!value || parseFloat(value) <= 0) {
        setFormErrors((prev) => ({
          ...prev,
          price: "Price must be a positive number",
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, price: "" }));
      }
    } else if (name === "duration") {
      if (!value || parseInt(value) < 20) {
        setFormErrors((prev) => ({
          ...prev,
          duration: "Duration must be at least 20 minutes",
        }));
      } else {
        setFormErrors((prev) => ({ ...prev, duration: "" }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          imageFile: "Please upload a valid image (JPEG, PNG, GIF)",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
      setFormErrors((prev) => ({ ...prev, imageFile: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.serviceName) {
      errors.serviceName = "Service name is required";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Price must be a positive number";
    }
    if (!formData.duration || parseInt(formData.duration) < 20) {
      errors.duration = "Duration must be at least 20 minutes";
    }
    if (!isEditing && !formData.imageFile) {
      errors.imageFile = "Image is required for new services";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = (index) => {
    setFormData({
      serviceName: services[index].serviceName,
      style: services[index].style || "",
      price: services[index].price,
      duration: services[index].duration || "",
      imageFile: null,
      imagePreview: services[index].shopImage
        ? getImageUrl(services[index].shopImage)
        : "",
    });
    setIsEditing(true);
    setEditIndex(index);
    setShowForm(true);
    setFormErrors({});
    if (screenWidth <= 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const createNotifications = async (service, parlorName, action) => {
    try {
      const userEmail = localStorage.getItem("email");
      const serviceName = `${service.serviceName}${
        service.style ? ` (${service.style})` : ""
      }`;
      const serviceId = service._id;

      await axios.post(
        `${BASE_URL}/api/notifications/create-service-notification`,
        {
          parlorEmail: userEmail,
          serviceId,
          serviceName,
        }
      );
    } catch (error) {
      console.error(
        "ServicePage: Failed to create notifications:",
        error.message
      );
      setSuccessMessage((prev) => `${prev} (Notifications failed to send)`);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    if (isEditing) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  const handleCreate = async () => {
    const form = new FormData();
    form.append("serviceName", formData.serviceName);
    form.append("style", formData.style);
    form.append("price", formData.price);
    form.append("duration", formData.duration);
    if (formData.imageFile) {
      form.append("shopImage", formData.imageFile);
    }

    const userEmail = localStorage.getItem("email");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/add-service/${userEmail}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        const { services: updatedServices, parlorName } = response.data;
        setServices(updatedServices);
        setShowForm(false);
        setFormData({
          serviceName: "",
          style: "",
          price: "",
          duration: "",
          imageFile: null,
          imagePreview: "",
        });
        setFormErrors({});
        setSuccessMessage("Service added successfully!");
        setShowSuccess(true);
        setCurrentPage(1);

        const newService = updatedServices[0];
        await createNotifications(newService, parlorName, "added");
      }
    } catch (error) {
      console.error("ServicePage: Error adding service:", error.message);
      setFormErrors((prev) => ({
        ...prev,
        submit:
          error.response?.data?.message ||
          "Failed to add service. Please try again.",
      }));
    }
  };

  const handleUpdate = async () => {
    const form = new FormData();
    form.append("serviceName", formData.serviceName);
    form.append("style", formData.style);
    form.append("price", formData.price);
    form.append("duration", formData.duration);
    if (formData.imageFile) {
      form.append("shopImage", formData.imageFile);
    }

    const serviceId = services[editIndex]._id;

    try {
      const response = await axios.put(
        `${BASE_URL}/api/admin/update-service/${serviceId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        const { updatedService, parlorName } = response.data;
        const updatedServices = [...services];
        updatedServices[editIndex] = updatedService;
        setServices(updatedServices);
        setShowForm(false);
        setIsEditing(false);
        setFormData({
          serviceName: "",
          style: "",
          price: "",
          duration: "",
          imageFile: null,
          imagePreview: "",
        });
        setFormErrors({});
        setSuccessMessage("Service updated successfully!");
        setShowSuccess(true);

        await createNotifications(updatedService, parlorName, "updated");
      }
    } catch (error) {
      console.error("ServicePage: Error updating service:", error.message);
      setFormErrors((prev) => ({
        ...prev,
        submit:
          error.response?.data?.message ||
          "Failed to update service. Please try again.",
      }));
    }
  };

  const handleDeleteClick = (_id) => {
    setShowDeleteModal(true);
    setPendingDeleteId(_id);
  };

  const triggerDeleteAnimation = async (_id) => {
    setDeletingServiceId(_id);
    setShowDustbin(true);

    setTimeout(async () => {
      setShowDustbin(false);
      setShowDeleteModal(false);
      setDeletingServiceId(null);
      try {
        await axios.delete(`${BASE_URL}/api/admin/deleteService/${_id}`);
        fetchServices();
        const totalPages = Math.ceil(services.length / servicesPerPage);
        if (currentPage > totalPages && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("ServicePage: Error deleting service:", error.message);
      }
    }, 1000);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      triggerDeleteAnimation(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPendingDeleteId(null);
    setShowDustbin(false);
  };

  const handleAddService = async () => {
    const email = localStorage.getItem("email");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/check-employees/${email}`
      );
      const { hasEmployees } = response.data;

      if (hasEmployees) {
        setFormData({
          serviceName: "",
          style: "",
          price: "",
          duration: "",
          imageFile: null,
          imagePreview: "",
        });
        setShowForm(true);
        setIsEditing(false);
        setFormErrors({});
      } else {
        alert("Please add employee first.");
      }
    } catch (error) {
      console.error("ServicePage: Error checking employees:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (showDeleteModal || showSuccess) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDeleteModal, showSuccess]);

  const isMobile = screenWidth <= 768;
  const isVerySmallScreen = screenWidth <= 400;

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const getImageUrl = (shopImage) => {
    if (!shopImage) return "/images/placeholder.jpg";
    const normalizedPath = shopImage.replace(/\\/g, "/");
    return `${BASE_URL.replace(/\/$/, "")}/${normalizedPath}`;
  };

  const totalPages = Math.ceil(services.length / servicesPerPage);

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
    <div className="service-page">
      {showSuccess &&
        createPortal(
          <SuccessMessage
            message={successMessage}
            onClose={() => setShowSuccess(false)}
            screenWidth={screenWidth}
          />,
          document.body
        )}

      <h2 className="service-title">Service Management</h2>

      <button className="add-service-btn" onClick={handleAddService}>
        + Add Service
      </button>

      {showForm &&
        (() => {
          const roleOptions = {
            Salon: ["HairCut", "Facial", "HairColor", "Shaving"],
            Beauty_Parler: ["HairCut", "Bridal", "Waxing", "Pedicure"],
            Doctor: ["Hair Treatment", "Skin Treatment"],
          };
          const options = roleOptions[role] || [];

          return (
            <div className="service-form">
              <div className="form-field">
                <select
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="" disabled>
                    Select Service
                  </option>
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {formErrors.serviceName && (
                  <span className="error-message">
                    {formErrors.serviceName}
                  </span>
                )}
              </div>

              <div className="form-field">
                <input
                  type="text"
                  name="style"
                  placeholder="Style (e.g. Layer Cut, Balayage)"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  min="0.01"
                  step="0.01"
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                {formErrors.price && (
                  <span className="error-message">{formErrors.price}</span>
                )}
              </div>

              <div className="form-field">
                <input
                  type="number"
                  name="duration"
                  placeholder="Duration (minutes)"
                  value={formData.duration}
                  min="20"
                  step="1"
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                {formErrors.duration && (
                  <span className="error-message">{formErrors.duration}</span>
                )}
              </div>

              <div className="form-field">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageChange}
                  className="form-file-input"
                  required={!isEditing}
                />
                {formErrors.imageFile && (
                  <span className="error-message">{formErrors.imageFile}</span>
                )}
              </div>

              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="image-preview"
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                    console.error(
                      "ServicePage: Error loading preview image:",
                      formData.imagePreview
                    );
                  }}
                />
              )}

              {formErrors.submit && (
                <span className="error-message submit-error">
                  {formErrors.submit}
                </span>
              )}

              <div className="form-actions">
                <button
                  onClick={handleSubmit}
                  className={`submit-btn ${isEditing ? "update-btn" : ""}`}
                  disabled={Object.values(formErrors).some((error) => error)}
                >
                  {isEditing ? "Update" : "Submit"}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(false);
                    setFormErrors({});
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })()}

      {showDeleteModal &&
        createPortal(
          <>
            <div className="delete-backdrop" onClick={handleCancelDelete} />
            <div
              className="delete-modal"
              style={{
                top: screenWidth <= 768 ? "45%" : "50%",
                left: "50%",
                width:
                  screenWidth <= 480
                    ? "90%"
                    : screenWidth <= 768
                    ? "85%"
                    : screenWidth <= 1024
                    ? "80%"
                    : "350px",
                maxWidth:
                  screenWidth <= 480
                    ? "260px"
                    : screenWidth <= 768
                    ? "300px"
                    : screenWidth <= 1024
                    ? "340px"
                    : "350px",
              }}
              onMouseEnter={() => {
                if (svgIconRef.current && !showDustbin) {
                  svgIconRef.current.style.animation =
                    "bounce 0.6s ease infinite";
                }
              }}
              onMouseLeave={() => {
                if (svgIconRef.current && !showDustbin) {
                  svgIconRef.current.style.animation = "none";
                }
              }}
            >
              {!showDustbin ? (
                <div className="delete-content">
                  <svg
                    ref={svgIconRef}
                    className="delete-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    />
                  </svg>
                  <h2 className="delete-title">Are you sure?</h2>
                  <p className="delete-text">
                    Do you really want to delete this service? This process
                    cannot be undone.
                  </p>
                </div>
              ) : (
                <div className="dustbin-animation">
                  <svg
                    className="dustbin-icon"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="8"
                      height="10"
                      rx="1"
                      fill="white"
                    />
                    <rect
                      className="lid"
                      x="4"
                      y="2"
                      width="8"
                      height="2"
                      rx="0.5"
                      fill="white"
                      style={{ transformOrigin: "4 2" }}
                    />
                    <path
                      d="M6 6H7V12H6V6Z"
                      fill="black"
                      style={{
                        opacity: showDustbin ? "0.5" : "1",
                        transition: "opacity 0.4s ease-out 0.3s",
                      }}
                    />
                    <path
                      d="M9 6H10V12H9V6Z"
                      fill="black"
                      style={{
                        opacity: showDustbin ? "0.5" : "1",
                        transition: "opacity 0.4s ease-out 0.3s",
                      }}
                    />
                  </svg>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="trash-particle"
                      style={{ animationDelay: `${0.3 + i * 0.05}s` }}
                    />
                  ))}
                </div>
              )}

              {!showDustbin && (
                <div className="delete-actions">
                  <button
                    className="delete-cancel-btn"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    className="delete-confirm-btn"
                    onClick={handleConfirmDelete}
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </>,
          document.body
        )}

      <div className="services-container1">
        {isMobile ? (
          <div className="mobile-services">
            {currentServices.map((svc, index) => (
              <div
                key={svc._id}
                ref={(el) => (itemRefs.current[svc._id] = el)}
                className={`service-card ${
                  deletingServiceId === svc._id ? "deleting" : ""
                }`}
                style={{
                  animationDelay: `${(indexOfFirstService + index) * 0.1}s`,
                }}
              >
                <div className="service-field">
                  <strong className="field-label">Service Name:</strong>
                  <span className="field-value">{svc.serviceName}</span>
                </div>
                <div className="service-field">
                  <strong className="field-label">Style:</strong>
                  <span className="field-value">{svc.style || "-"}</span>
                </div>
                <div className="service-field">
                  <strong className="field-label">Price:</strong>
                  <span className="field-value">₹{svc.price.toFixed(2)}</span>
                </div>
                <div className="service-field">
                  <strong className="field-label">Duration:</strong>
                  <span className="field-value">
                    {svc.duration ? `${svc.duration} min` : "-"}
                  </span>
                </div>
                <div className="service-field service-image-field">
                  <strong className="field-label">Image:</strong>
                  {svc.shopImage ? (
                    <img
                      src={getImageUrl(svc.shopImage)}
                      alt={svc.serviceName}
                      className="service-image"
                    />
                  ) : (
                    <span className="no-image">No Image</span>
                  )}
                </div>
                <div className="service-field service-actions">
                  <strong className="field-label">Actions:</strong>
                  <div className="action-buttons">
                    <div className="action-wrapper">
                      <button
                        onClick={() => handleEdit(indexOfFirstService + index)}
                        className="edit-btn"
                        onMouseEnter={() =>
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`edit_${svc._id}`]: true,
                          }))
                        }
                        onMouseLeave={() =>
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`edit_${svc._id}`]: false,
                          }))
                        }
                        onTouchStart={() =>
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`edit_${svc._id}`]: true,
                          }))
                        }
                        onTouchEnd={() =>
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`edit_${svc._id}`]: false,
                          }))
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          className="edit-icon"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Edit
                      </button>
                      <span
                        className="tooltip"
                        style={{
                          opacity: showTooltip[`edit_${svc._id}`] ? 1 : 0,
                          transform: `translateX(-50%) translateY(${
                            showTooltip[`edit_${svc._id}`] ? "0" : "10px"
                          })`,
                        }}
                      >
                        Edit
                      </span>
                    </div>

                    <div className="action-wrapper">
                      <button
                        onClick={() => handleDeleteClick(svc._id)}
                        className="delete-btn"
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#8B0000";
                          e.target.style.boxShadow = "0 0 12px #FFA500";
                          const svg = e.target.querySelector("svg");
                          if (svg)
                            svg.style.animation = "shake 0.3s ease-in-out";
                          const lid = svg && svg.querySelector(".lid");
                          if (lid)
                            lid.style.animation =
                              "openLid 0.2s ease-out forwards, closeLid 0.2s ease-out 0.4s forwards";
                          const paths = svg && svg.querySelectorAll("path");
                          paths &&
                            paths.forEach((p) => (p.style.opacity = "0.5"));
                          paths &&
                            paths.forEach(
                              (p) =>
                                (p.style.transition =
                                  "opacity 0.2s ease-out 0.2s")
                            );
                          const particles =
                            e.target.querySelectorAll(".particle");
                          particles.forEach((p, i) => {
                            p.style.animation = `throwTrash 0.2s ease-out ${
                              0.2 + i * 0.05
                            }s forwards`;
                          });
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`delete_${svc._id}`]: true,
                          }));
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#0e0f0f";
                          e.target.style.boxShadow =
                            "0px 0px 15px rgba(0, 0, 0, 0.164)";
                          const svg = e.target.querySelector("svg");
                          if (svg) svg.style.animation = "none";
                          const lid = svg && svg.querySelector(".lid");
                          if (lid) lid.style.animation = "none";
                          const paths = svg && svg.querySelectorAll("path");
                          paths &&
                            paths.forEach((p) => (p.style.opacity = "1"));
                          paths &&
                            paths.forEach((p) => (p.style.transition = "none"));
                          const particles =
                            e.target.querySelectorAll(".particle");
                          particles.forEach(
                            (p) => (p.style.animation = "none")
                          );
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`delete_${svc._id}`]: false,
                          }));
                        }}
                        onTouchStart={(e) => {
                          e.target.style.backgroundColor = "#8B0000";
                          e.target.style.boxShadow = "0 0 12px #FFA500";
                          const svg = e.target.querySelector("svg");
                          if (svg)
                            svg.style.animation = "shake 0.3s ease-in-out";
                          const lid = svg && svg.querySelector(".lid");
                          if (lid)
                            lid.style.animation =
                              "openLid 0.2s ease-out forwards, closeLid 0.2s ease-out 0.4s forwards";
                          const paths = svg && svg.querySelectorAll("path");
                          paths &&
                            paths.forEach((p) => (p.style.opacity = "0.5"));
                          paths &&
                            paths.forEach(
                              (p) =>
                                (p.style.transition =
                                  "opacity 0.2s ease-out 0.2s")
                            );
                          const particles =
                            e.target.querySelectorAll(".particle");
                          particles.forEach((p, i) => {
                            p.style.animation = `throwTrash 0.2s ease-out ${
                              0.2 + i * 0.05
                            }s forwards`;
                          });
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`delete_${svc._id}`]: true,
                          }));
                        }}
                        onTouchEnd={(e) => {
                          e.target.style.backgroundColor = "#0e0f0f";
                          e.target.style.boxShadow =
                            "0px 0px 15px rgba(0, 0, 0, 0.164)";
                          const svg = e.target.querySelector("svg");
                          if (svg) svg.style.animation = "none";
                          const lid = svg && svg.querySelector(".lid");
                          if (lid) lid.style.animation = "none";
                          const paths = svg && svg.querySelectorAll("path");
                          paths &&
                            paths.forEach((p) => (p.style.opacity = "1"));
                          paths &&
                            paths.forEach((p) => (p.style.transition = "none"));
                          const particles =
                            e.target.querySelectorAll(".particle");
                          particles.forEach(
                            (p) => (p.style.animation = "none")
                          );
                          setShowTooltip((prev) => ({
                            ...prev,
                            [`delete_${svc._id}`]: false,
                          }));
                        }}
                      >
                        <svg
                          className="delete-icon-small"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="4"
                            y="4"
                            width="8"
                            height="10"
                            rx="1"
                            fill="white"
                          />
                          <rect
                            className="lid"
                            x="4"
                            y="2"
                            width="8"
                            height="2"
                            rx="0.5"
                            fill="white"
                            style={{ transformOrigin: "4 2" }}
                          />
                          <path d="M6 6H7V12H6V6Z" fill="black" />
                          <path d="M9 6H10V12H9V6Z" fill="black" />
                        </svg>
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="particle"
                            style={{
                              top: isMobile ? "10px" : "12px",
                            }}
                          />
                        ))}
                      </button>
                      <span
                        className="tooltip"
                        style={{
                          opacity: showTooltip[`delete_${svc._id}`] ? 1 : 0,
                          transform: `translateX(-50%) translateY(${
                            showTooltip[`delete_${svc._id}`] ? "0" : "10px"
                          })`,
                        }}
                      >
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {currentServices.length === 0 && (
              <div className="no-services">No Services Found</div>
            )}
          </div>
        ) : (
          <div className="desktop-services">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Style</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentServices.map((svc, index) => (
                  <tr
                    key={svc._id}
                    ref={(el) => (itemRefs.current[svc._id] = el)}
                    className={`service-row ${
                      deletingServiceId === svc._id ? "deleting" : ""
                    }`}
                    style={{
                      animationDelay: `${(indexOfFirstService + index) * 0.1}s`,
                      backgroundColor:
                        (indexOfFirstService + index) % 2 === 0
                          ? "#f9fbfc"
                          : "#ffffff",
                    }}
                  >
                    <td>{svc.serviceName}</td>
                    <td>{svc.style || "-"}</td>
                    <td>₹{svc.price.toFixed(2)}</td>
                    <td>{svc.duration ? `${svc.duration} min` : "-"}</td>
                    <td>
                      {svc.shopImage ? (
                        <img
                          src={getImageUrl(svc.shopImage)}
                          alt={svc.serviceName}
                          className="service-image"
                        />
                      ) : (
                        <span className="no-image">No Image</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <div className="action-wrapper">
                          <button
                            onClick={() =>
                              handleEdit(indexOfFirstService + index)
                            }
                            className="edit-btn"
                            onMouseEnter={() =>
                              setShowTooltip((prev) => ({
                                ...prev,
                                [`edit_${svc._id}`]: true,
                              }))
                            }
                            onMouseLeave={() =>
                              setShowTooltip((prev) => ({
                                ...prev,
                                [`edit_${svc._id}`]: false,
                              }))
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              className="edit-icon"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            Edit
                          </button>
                          <span
                            className="tooltip"
                            style={{
                              opacity: showTooltip[`edit_${svc._id}`] ? 1 : 0,
                              transform: `translateX(-50%) translateY(${
                                showTooltip[`edit_${svc._id}`] ? "0" : "10px"
                              })`,
                            }}
                          >
                            Edit
                          </span>
                        </div>

                        <div className="action-wrapper">
                          <button
                            onClick={() => handleDeleteClick(svc._id)}
                            className="delete-btn"
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#8B0000";
                              e.target.style.boxShadow = "0 0 12px #FFA500";
                              const svg = e.target.querySelector("svg");
                              if (svg)
                                svg.style.animation = "shake 0.3s ease-in-out";
                              const lid = svg && svg.querySelector(".lid");
                              if (lid)
                                lid.style.animation =
                                  "openLid 0.2s ease-out forwards, closeLid 0.2s ease-out 0.4s forwards";
                              const paths = svg && svg.querySelectorAll("path");
                              paths &&
                                paths.forEach((p) => (p.style.opacity = "0.5"));
                              paths &&
                                paths.forEach(
                                  (p) =>
                                    (p.style.transition =
                                      "opacity 0.2s ease-out 0.2s")
                                );
                              const particles =
                                e.target.querySelectorAll(".particle");
                              particles.forEach((p, i) => {
                                p.style.animation = `throwTrash 0.2s ease-out ${
                                  0.2 + i * 0.05
                                }s forwards`;
                              });
                              setShowTooltip((prev) => ({
                                ...prev,
                                [`delete_${svc._id}`]: true,
                              }));
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "#0e0f0f";
                              e.target.style.boxShadow =
                                "0px 0px 15px rgba(0, 0, 0, 0.164)";
                              const svg = e.target.querySelector("svg");
                              if (svg) svg.style.animation = "none";
                              const lid = svg && svg.querySelector(".lid");
                              if (lid) lid.style.animation = "none";
                              const paths = svg && svg.querySelectorAll("path");
                              paths &&
                                paths.forEach((p) => (p.style.opacity = "1"));
                              paths &&
                                paths.forEach(
                                  (p) => (p.style.transition = "none")
                                );
                              const particles =
                                e.target.querySelectorAll(".particle");
                              particles.forEach(
                                (p) => (p.style.animation = "none")
                              );
                              setShowTooltip((prev) => ({
                                ...prev,
                                [`delete_${svc._id}`]: false,
                              }));
                            }}
                          >
                            <svg
                              className="delete-icon-small"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="4"
                                y="4"
                                width="8"
                                height="10"
                                rx="1"
                                fill="black"
                              />
                              <rect
                                className="lid"
                                x="4"
                                y="2"
                                width="8"
                                height="2"
                                rx="0.5"
                                fill="black"
                                style={{ transformOrigin: "4 2" }}
                              />
                              <path d="M6 6H7V12H6V6Z" fill="white" />
                              <path d="M9 6H10V12H9V6Z" fill="white" />
                            </svg>
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="particle"
                                style={{
                                  top: "12px",
                                }}
                              />
                            ))}
                          </button>
                          <span
                            className="tooltip"
                            style={{
                              opacity: showTooltip[`delete_${svc._id}`] ? 1 : 0,
                              transform: `translateX(-50%) translateY(${
                                showTooltip[`delete_${svc._id}`] ? "0" : "10px"
                              })`,
                            }}
                          >
                            Delete
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentServices.length === 0 && (
              <div className="no-services">No Services Found</div>
            )}
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="pagination-info">
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
  );
};

export default ServicePage;
