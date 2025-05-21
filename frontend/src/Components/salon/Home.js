"use client";

import { useState, useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Import images
import salonImage from "../Assets/salon.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const modalRef = useRef(null);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [addresses, setAddresses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 5;

  const slides = [
    {
      image: "https://m.media-amazon.com/images/I/71POqHTHB7L.jpg",
      title: "Welcome to Beauty Bliss",
      description:
        "Step into elegance and unwind with our top-tier salon experiences designed just for you.",
      link: "/salon",
    },
    {
      image:
        "https://healthupriser.com/wp-content/uploads/2022/12/Skincare-Routines-for-Different-Skin-Types-and-Concerns.jpg",
      title: "Personalized Skincare",
      description:
        "Glow naturally with treatments tailored for your unique skin type and concerns.",
      link: "/skincare",
    },
    {
      image:
        "https://play-lh.googleusercontent.com/fo4ebNWvkgfRIbTUJf2BHKuq3Ba2NvmuAkE_qzoAnbYflzPGQOnKeQsTnxi_koyIOA",
      title: "Luxury Beauty Rituals",
      description:
        "Reveal your inner glow with our luxurious beauty therapies and expert care.",
      link: "/beauty",
    },
    {
      image:
        "https://img.freepik.com/premium-photo/assortment-makeup-brushes-cosmetics-wooden-background_36682-127100.jpg",
      title: "Refined Elegance",
      description:
        "Discover timeless beauty with our exclusive signature treatments.",
      link: "/beauty",
    },
    {
      image:
        "https://easy-peasy.ai/cdn-cgi/image/quality=70,format=auto,width=300/https://media.easy-peasy.ai/c4cea1cf-01dc-47c2-87c2-944e2af7ad4f/e6f69c3b-a0b1-496c-aae0-6b68b176ca6e.png",
      title: "Happy Customers, Radiant Smiles",
      description:
        "Join our community of satisfied clients who trust us for their beauty needs.",
      link: "/beauty",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    navigate("/salon");
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/main/admin/get/all/service-providers`
        );
        const providers = response.data;
        setServiceProviders(providers.reverse());
        setFilteredProviders(providers);
      } catch (error) {
        setError("Failed to load service providers. Please try again.");
      }
    };
    fetchServiceProviders();
  }, []);

  useEffect(() => {
    let filtered = serviceProviders;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((provider) => {
        const fieldsToSearch = [
          provider.name || "",
          provider.email || "",
          provider.phone || "",
          provider.shopName || "",
          provider.designation || "",
          provider.location || "",
          formatDate(provider.createdAt) || "",
          formatDate(provider.dob) || "",
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

    setFilteredProviders(filtered);
    setCurrentPage(1);
  }, [searchQuery, startDateFilter, endDateFilter, serviceProviders]);

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

  const parseCoordinates = (location) => {
    if (!location || typeof location !== "string") {
      return { latitude: null, longitude: null };
    }
    try {
      const latMatch = location.match(/Lat: ([\d.-]+)/);
      const lonMatch = location.match(/Lon: ([\d.-]+)/);
      const latitude = latMatch ? Number.parseFloat(latMatch[1]) : null;
      const longitude = lonMatch ? Number.parseFloat(lonMatch[1]) : null;
      return { latitude, longitude };
    } catch (error) {
      return { latitude: null, longitude: null };
    }
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

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
    }
  };

  const handleServiceClick = (service) => {
    navigate("/products", {
      state: { designation: "Salon", service: service },
    });
  };

  const handleBeautyClick = (service) => {
    navigate("/products", {
      state: { designation: "Beauty_Parler", service: service },
    });
  };

  const getMapLink = (location) => {
    const { latitude, longitude } = parseCoordinates(location);
    const lat = latitude !== null ? latitude : 17.359699;
    const lon = longitude !== null ? longitude : 78.534277;
    return `https://www.google.com/maps?q=${lat},${lon}`;
  };

  useEffect(() => {
    if (enquiryModalOpen) {
      const fetchServiceProviders = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/main/admin/get/all/service-providers`
          );
          setServiceProviders(response.data);
        } catch (error) {
          console.error("Failed to fetch service providers:", error);
        }
      };
      fetchServiceProviders();
    }
  }, [enquiryModalOpen, BASE_URL]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setEnquiryModalOpen(false);
      }
    };

    if (enquiryModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [enquiryModalOpen]);

  const FilterToggleButton = styled(IconButton)(({ theme }) => ({
    display: "none",
    [theme.breakpoints.down("lg")]: {
      display: "block",
      color: "#201548",
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "rgba(32, 21, 72, 0.1)",
      },
    },
  }));

  const handleSubmitEnquiry = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      alert("Please login to submit an enquiry.");
      window.location.href = "/login";
      return;
    }
    if (!selectedProvider || !enquiryMessage) {
      alert("Please select a service provider and enter a message.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/users/enquiries`, {
        parlorEmail: selectedProvider,
        message: enquiryMessage,
        email,
      });

      if (response.status === 201) {
        alert("Enquiry submitted successfully!");
        setEnquiryModalOpen(false);
        setEnquiryMessage("");
        setSelectedProvider("");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("Failed to submit enquiry. Please try again.");
    }
  };

  const handleEnquiryClick = () => {
    navigate("/products", { state: { openEnquiryModal: true } });
    alert("Please set your location to proceed with the enquiry.");
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        color: "rgb(244,245,247)",
      }}
    >
      <section id="banner" style={{ background: "#ffffff", padding: "0" }}>
        <div className="coverflow-container">
          <div className="coverflow">
            {[...slides, ...slides, ...slides].map((slide, index) => {
              const totalSlides = slides.length;
              const virtualIndex = index - totalSlides;
              const offset = virtualIndex - (currentSlide % totalSlides);
              const absOffset = Math.abs(offset);
              const isActive = absOffset < 0.5;
              const isVisible = absOffset <= 1;
              return (
                <div
                  key={`${slide.title}-${index}`}
                  className={`coverflow-item ${isActive ? "active" : ""}`}
                  style={{
                    transform: `
                      translateX(${offset * 320}px)
                      rotateY(${offset * -15}deg)
                      scale(${1 - absOffset * 0.12})
                    `,
                    zIndex: 100 - Math.floor(absOffset),
                    opacity: Math.max(1 - absOffset * 0.35, 0.2),
                  }}
                >
                  <div className="coverflow-image-wrapper">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      // onError={(e) => {
                      //   e.target.src =
                      //     "https://via.placeholder.com/480x360?text=Image+Not+Found";
                      // }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="coverflow-overlay"></div>
                  <div className="coverflow-caption">
                    <motion.h2
                      className="coverflow-title"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: isVisible ? 1 : 0,
                        y: isVisible ? 0 : 20,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {slide.title}
                    </motion.h2>
                    <motion.p
                      className="coverflow-description"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: isVisible ? 1 : 0,
                        y: isVisible ? 0 : 20,
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {slide.description}
                    </motion.p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="coverflow-control prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <span>‹</span>
          </button>
          <button
            className="coverflow-control next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <span>›</span>
          </button>
          <div className="coverflow-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentSlide % slides.length ? "active" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
        <style>
          {`
            .coverflow-container {
              position: relative;
              width: 100%;
              height: 580px;
              perspective: 1000px;
              overflow: hidden;
              background: linear-gradient(180deg, #f8f9fa, #ffffff);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .coverflow {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              transform-style: preserve-3d;
            }
            .coverflow-item {
              position: absolute;
              width: 480px;
              height: 360px;
              transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: 0 15px 30px rgba(32, 21, 72, 0.2);
              border-radius: 16px;
              overflow: hidden;
              background: #ffffff;
              border: 2px solid #201548;
            }
            .coverflow-item.active {
              transform: translateX(0) rotateY(0deg) scale(1);
              z-index: 100;
              opacity: 1;
            }
            .coverflow-image-wrapper {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            .coverflow-item img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              filter: brightness(80%) contrast(1.1);
              display: block;
            }
            .coverflow-overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(
                to bottom,
                rgba(32, 21, 72, 0.1),
                rgba(32, 21, 72, 0.5)
              );
            }
            .coverflow-caption {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              padding: 20px;
              background: rgba(32, 21, 72, 0.75);
              backdrop-filter: blur(8px);
              color: #ffffff;
              text-align: center;
              border-bottom-left-radius: 14px;
              border-bottom-right-radius: 14px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .coverflow-title {
              font-size: 2.2rem;
              font-weight: 700;
              margin-bottom: 10px;
              text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
              font-family: 'Poppins', sans-serif;
              line-height: 1.2;
            }
            .coverflow-description {
              font-size: 1.15rem;
              margin-bottom: 15px;
              text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
              font-family: 'Poppins', sans-serif;
              max-width: 85%;
              line-height: 1.4;
            }
            .btn-conteiner {
              display: flex;
              justify-content: center;
            }
            .coverflow-control {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              background: rgba(32, 21, 72, 0.6);
              border: 2px solid #ffffff;
              color: #ffffff;
              font-size: 2.5rem;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 200;
            }
            .coverflow-control:hover {
              background: #201548;
              transform: translateY(-50%) scale(1.1);
              box-shadow: 0 5px 15px rgba(32, 21, 72, 0.4);
            }
            .coverflow-control.prev {
              left: 30px;
            }
            .coverflow-control.next {
              right: 30px;
            }
            .coverflow-indicators {
              position: absolute;
              bottom: 25px;
              left: 50%;
              transform: translateX(-50%);
              display: flex;
              gap: 12px;
              z-index: 200;
            }
            .indicator {
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: #ffffff;
              opacity: 0.6;
              border: 1px solid #201548;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            .indicator.active {
              opacity: 1;
              background: #201548;
              transform: scale(1.2);
            }
            @media (max-width: 992px) {
              .coverflow-container {
                height: 480px;
              }
              .coverflow-item {
                width: 400px;
                height: 300px;
              }
              .coverflow-title {
                font-size: 1.8rem;
              }
              .coverflow-description {
                font-size: 1rem;
                max-width: 90%;
              }
            }
            @media (max-width: 768px) {
              .coverflow-container {
                height: 500px;
              }
              .coverflow-item {
                width: 400px;
                height: 300px;
              }
              .coverflow-title {
                font-size: 1.5rem;
              }
              .coverflow-description {
                font-size: 0.9rem;
              }
              .coverflow-control {
                width: 40px;
                height: 40px;
                font-size: 1.5rem;
                top: auto;
                bottom: 10px;
                transform: translateX(0);
                background: rgba(32, 21, 72, 0.8);
              }
              .coverflow-control.prev {
                left: calc(50% - 60px);
              }
              .coverflow-control.next {
                right: calc(50% - 60px);
                left: auto;
              }
              .coverflow-control:hover {
                transform: scale(1.1);
              }
            }
            @media (max-width: 576px) {
              .coverflow-container {
                height: 440px;
              }
              .coverflow-item {
                width: 340px;
                height: 255px;
              }
              .coverflow-title {
                font-size: 1.3rem;
                margin-bottom: 8px;
              }
              .coverflow-description {
                font-size: 0.8rem;
                margin-bottom: 12px;
              }
              .coverflow-caption {
                padding: 15px;
              }
              .coverflow-control {
                width: 36px;
                height: 36px;
                font-size: 1.3rem;
                top: auto;
                bottom: 8px;
                transform: translateX(0);
                background: rgba(32, 21, 72, 0.8);
              }
              .coverflow-control.prev {
                left: calc(23% - 50px);
              }
              .coverflow-control.next {
                right: calc(50% - 114px);
                left: auto;
              }
              .coverflow-control:hover {
                transform: scale(1.1);
              }
              .indicator {
                width: 12px;
                height: 12px;
              }
            }

            .coverflow-control {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              background: rgba(32, 21, 72, 0.7);
              border: 2px solid #ffffff;
              color: #ffffff;
              font-size: 2rem;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 200;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }

            .coverflow-control:hover {
              background: #201548;
              transform: translateY(-50%) scale(1.05);
              box-shadow: 0 6px 15px rgba(32, 21, 72, 0.4);
            }

            .coverflow-control.prev {
              left: 20px;
            }

            .coverflow-control.next {
              right: 20px;
            }

            .coverflow-control span {
              font-size: 2rem;
              line-height: 1;
            }

            @media (max-width: 992px) {
              .coverflow-control {
                width: 45px;
                height: 45px;
                font-size: 1.8rem;
              }
              .coverflow-control.prev {
                left: 15px;
              }
              .coverflow-control.next {
                right: 15px;
              }
              .coverflow-control span {
                font-size: 1.8rem;
              }
            }

            @media (max-width: 768px) {
              .coverflow-control {
                width: 40px;
                height: 40px;
                font-size: 1.5rem;
                top: 50%;
                transform: translateY(-50%);
              }
              .coverflow-control.prev {
                left: 10px;
              }
              .coverflow-control.next {
                right: 10px;
              }
              .coverflow-control span {
                font-size: 1.5rem;
              }
            }

            @media (max-width: 576px) {
              .coverflow-control {
                width: 36px;
                height: 36px;
                font-size: 1.3rem;
                top: 50%;
                transform: translateY(-50%);
              }
              .coverflow-control.prev {
                left: 8px;
              }
              .coverflow-control.next {
                right: 8px;
              }
              .coverflow-control span {
                font-size: 1.3rem;
              }
            }
          `}
        </style>
      </section>

      <div
        className="container-fluid d-flex align-items-center justify-content-center px-3 px-md-5"
        style={{ backgroundColor: "rgb(233, 235, 238)", minHeight: "82vh" }}
      >
        <style>
          {`
            .btn-conteiner {
              display: flex;
              justify-content: center;
              --color-text: rgb(244,245,247);
              --color-background: #201548;
              --color-outline: rgba(32, 21, 72, 0.5);
              --color-shadow: rgba(32, 21, 72, 0.5);
            }

            .btn-content {
              display: flex;
              align-items: center;
              padding: 12px 30px;
              text-decoration: none;
              font-family: 'Poppins', sans-serif;
              font-weight: 600;
              font-size: 18px;
              color: var(--color-text);
              background: var(--color-background);
              transition: all 0.5s ease;
              border-radius: 50px;
              box-shadow: 0 5px 15px var(--color-shadow);
              border: none;
              position: relative;
              overflow: hidden;
              z-index: 1;
            }

            .btn-content::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 0%;
              height: 100%;
              background: rgba(255, 255, 255, 0.2);
              transition: all 0.5s ease;
              z-index: -1;
            }

            .btn-content:hover::before {
              width: 100%;
            }

            .btn-content:hover, .btn-content:focus {
              transform: translateY(-3px);
              box-shadow: 0 8px 20px var(--color-shadow);
            }

            .btn-content .icon-arrow {
              transition: 0.5s;
              margin-right: 0px;
              transform: scale(0.6);
            }

            .btn-content:hover .icon-arrow {
              transition: 0.5s;
              margin-right: 25px;
            }

            .icon-arrow {
              width: 20px;
              margin-left: 15px;
              position: relative;
              top: 6%;
            }

            #arrow-icon-one, #arrow-icon-two, #arrow-icon-three {
              fill: #ffffff;
              transition: 0.4s;
              transform: translateX(-60%);
            }

            .btn-content:hover #arrow-icon-one {
              transform: translateX(0%);
              animation: color_anim 1s infinite 0.6s;
            }

            .btn-content:hover #arrow-icon-two {
              transform: translateX(0%);
              animation: color_anim 1s infinite 0.4s;
            }

            .btn-content:hover #arrow-icon-three {
              animation: color_anim 1s infinite 0.2s;
            }

            @keyframes color_anim {
              0% { fill: white; }
              50% { fill: rgba(255, 255, 255, 0.5); }
              100% { fill: white; }
            }

            @media (max-width: 576px) {
              .btn-content {
                font-size: 16px;
                padding: 10px 20px;
              }
              .icon-arrow {
                width: 15px;
                margin-left: 10px;
              }
            }

            @media (max-width: 767px) {
              #skincare .col-md-6.text-start {
                text-align: center !important;
                padding: 0 15px;
              }

              #skincare h2.section-title {
                font-size: 1.8rem !important;
                margin-bottom: 1rem;
              }

              #skincare h3.fw-bold {
                font-size: 1.5rem !important;
                line-height: 1.4;
              }

              #skincare p.lead {
                font-size: 1rem !important;
                line-height: 1.5;
                max-width: 100%;
              }

              #skincare ul.list-unstyled li {
                max-width: 100% !important;
                padding: 10px 15px;
                font-size: 0.9rem;
              }

              #skincare .animate__animated {
                animation-duration: 0.8s;
              }

              #skincare .img-wrapper {
                position: relative !important;
                top: 0 !important;
                left: 0 !important;
                margin-bottom: 10px;
              }

              #skincare .custom-img {
                width: 330px;
                height: 200px !important;
                max-width: 300px;
                margin: 0 auto;
              }

              #skincare .position-relative.d-flex {
                height: auto !important;
                flex-direction: column;
                align-items: center;
              }
            }

            ul.list-unstyled li {
              width: 100%;
              max-width: 100%;
              box-sizing: border-box;
            }

            section#skincare {
              padding: 30px 0;
            }

            #skincare .col-md-6.text-start p,
            #skincare .col-md-6.text-start li {
              word-wrap: break-word;
            }

            .section-title {
              color: #201548;
              font-weight: 700;
              position: relative;
              display: inline-block;
              margin-bottom: 1.5rem;
            }

            .section-title::after {
              content: '';
              position: absolute;
              bottom: -10px;
              left: 0;
              width: 60px;
              height: 3px;
              background: #201548;
              border-radius: 2px;
            }

            .hover-card {
              transition: all 0.3s ease;
              border: 1px solid rgba(32, 21, 72, 0.1);
              border-radius: 12px;
              overflow: hidden;
            }

            .hover-card:hover {
              transform: translateY(-10px);
              box-shadow: 0 15px 30px rgba(32, 21, 72, 0.2);
            }

            .img-hover {
              transition: all 0.5s ease;
              overflow: hidden;
            }

            .img-hover img {
              transition: all 0.5s ease;
            }

            .img-hover:hover img {
              transform: scale(1.05);
            }

            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .fade-up {
              animation: fadeUp 0.8s ease forwards;
            }

            .delay-1 { animation-delay: 0.1s; }
            .delay-2 { animation-delay: 0.2s; }
            .delay-3 { animation-delay: 0.3s; }
            .delay-4 { animation-delay: 0.4s; }
            .delay-5 { animation-delay: 0.5s; }
          `}
        </style>

        <div className="row w-100 align-items-center g-4">
          <div className="col-md-6 text-center text-md-start">
            <motion.h1
              className="display-4 fw-bold"
              style={{ color: "#0e0f0f" }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Your One-Stop{" "}
              <span style={{ color: "#201548" }}>Beauty Destination</span>
            </motion.h1>

            <motion.p
              className="mt-3"
              style={{ color: "#0e0f0f", fontSize: "1.1rem" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Discover expert services from salon to skincare in one elegant
              space.
            </motion.p>

            <motion.div
              className="mt-4 d-flex flex-column flex-sm-row flex-wrap gap-3 justify-content-center justify-content-md-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="btn-conteiner">
                <a href="/salon" className="btn-content">
                  <span>Salon</span>
                </a>
              </div>

              <div className="btn-conteiner">
                <a href="/beauty" className="btn-content">
                  <span>Beauty</span>
                </a>
              </div>

              <div className="btn-conteiner">
                <a href="/skincare" className="btn-content">
                  <span>Doctor</span>
                </a>
              </div>
              <div className="btn-conteiner">
                <button onClick={handleEnquiryClick} className="btn-content">
                  <span>Enquiry</span>
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="col-md-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="img-hover">
              <img
                src={salonImage || "/placeholder.svg"}
                alt="Beauty Services"
                className="img-fluid rounded"
                style={{
                  maxHeight: "320px",
                  objectFit: "cover",
                  border: `2px solid #201548`,
                  boxShadow: "0 20px 40px rgba(32, 21, 72, 0.3)",
                  width: "100%",
                  maxWidth: "500px",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-fluid px-0">
        <section
          className="py-5"
          id="salon"
          style={{
            background: "#ffffff",
            padding: "60px 0",
          }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 text-center">
                <motion.h2
                  className="section-title mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.8 }}
                >
                  Premium Salon Services
                </motion.h2>
                <motion.p
                  className="mb-5"
                  style={{
                    color: "#0e0f0f",
                    maxWidth: "700px",
                    margin: "0 auto 40px",
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Experience luxury hair care with our expert stylists using
                  top-quality products for your perfect look.
                </motion.p>

                <div className="row g-4">
                  <motion.div
                    className="col-12 col-sm-6 col-lg-3"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    onClick={() => handleServiceClick("HairCut")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card h-100 shadow-lg border-0 hover-card">
                      <div className="img-hover">
                        <img
                          src="https://images.fresha.com/lead-images/placeholders/barbershop-54.jpg?class=venue-gallery-mobile"
                          alt="Precision Haircut"
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="card-body p-4 text-center">
                        <h5
                          className="card-title mb-3"
                          style={{ color: "#201548", fontWeight: "600" }}
                        >
                          Precision Haircuts
                        </h5>
                        <p
                          className="card-text mb-4"
                          style={{ color: "#0e0f0f" }}
                        >
                          Tailored cuts to suit your style and face shape,
                          crafted by master stylists.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="col-12 col-sm-6 col-lg-3"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    onClick={() => handleServiceClick("HairColor")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card h-100 shadow-lg border-0 hover-card">
                      <div className="img-hover">
                        <img
                          src="https://trademarksalon.com/wp-content/uploads/2024/03/Balayage-vs.-Highlights.jpg"
                          alt="Balayage & Highlights"
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="card-body p-4 text-center">
                        <h5
                          className="card-title mb-3"
                          style={{ color: "#201548", fontWeight: "600" }}
                        >
                          Balayage & Highlights
                        </h5>
                        <p
                          className="card-text mb-4"
                          style={{ color: "#0e0f0f" }}
                        >
                          Vibrant, hand-painted color for a natural, glowing
                          finish.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="col-12 col-sm-6 col-lg-3"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    onClick={() => handleServiceClick("Facial")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card h-100 shadow-lg border-0 hover-card">
                      <div className="img-hover">
                        <img
                          src="https://media.istockphoto.com/id/921797424/photo/woman-in-mask-on-face-in-spa-beauty-salon.jpg?s=612x612&w=0&k=20&c=gGSPZOjIS2wcwQyOcjANOKpRVU0KR_iEDbRACnAoIXA="
                          alt="Facial"
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="card-body p-4 text-center">
                        <h5
                          className="card-title mb-3"
                          style={{ color: "#201548", fontWeight: "600" }}
                        >
                          Facial
                        </h5>
                        <p
                          className="card-text mb-4"
                          style={{ color: "#0e0f0f" }}
                        >
                          Rejuvenate your skin with customized facials for a
                          radiant, glowing complexion.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="col-12 col-sm-6 col-lg-3"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    onClick={() => handleServiceClick("Shaving")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card h-100 shadow-lg border-0 hover-card">
                      <div className="img-hover">
                        <img
                          src="https://cdn.shopify.com/s/files/1/0459/6563/9834/files/front-view-man-holding-shaving-razor_480x480.jpg?v=1699258613"
                          alt="Shaving"
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="card-body p-4 text-center">
                        <h5
                          className="card-title mb-3"
                          style={{ color: "#201548", fontWeight: "600" }}
                        >
                          Shaving
                        </h5>
                        <p
                          className="card-text mb-4"
                          style={{ color: "#0e0f0f" }}
                        >
                          Enjoy a smooth, precise shave with our expert grooming
                          services.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-5"
          id="beauty"
          style={{
            background: "#f8f9fa",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflowX: "hidden",
            padding: "60px 0",
          }}
        >
          <div className="container">
            <div className="text-center">
              <motion.h2
                className="section-title mb-4"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8 }}
              >
                Luxury Beauty Treatments
              </motion.h2>

              <motion.p
                className="lead mb-5"
                style={{
                  fontSize: "1.1rem",
                  color: "#0e0f0f",
                  maxWidth: "700px",
                  margin: "0 auto 40px",
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Discover the best beauty treatments to indulge yourself.
              </motion.p>

              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {[
                  {
                    name: "Bridal",
                    title: "Bridal Makeup",
                    text: "Flawless makeup for your big day.",
                    img: "https://queensinstyle.com/assets/images/logo-3.png",
                    delay: 0.1,
                  },
                  {
                    name: "HairCut",
                    title: "Haircut",
                    text: "Perfect nails with vibrant gel colors.",
                    img: "https://cdn.pixabay.com/photo/2012/04/13/18/16/haircut-33130_640.png",
                    delay: 0.2,
                  },
                  {
                    name: "Waxing",
                    title: "Waxing",
                    text: "Creative designs to showcase your style.",
                    img: "https://images.vexels.com/media/users/3/321110/isolated/preview/c221075ca31010635bca0be5654ae2f1-wax-jar-with-spatula.png",
                    delay: 0.3,
                  },
                  {
                    name: "Pedicure",
                    title: "Spa Pedicures",
                    text: "Relaxing treatments for soft, pampered feet.",
                    img: "https://png.pngtree.com/png-vector/20230924/ourmid/pngtree-pedicure-and-manicure-toe-png-image_9990440.png",
                    delay: 0.4,
                  },
                ].map((card, idx) => (
                  <motion.div
                    className="col"
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    onClick={() => handleBeautyClick(card.name)}
                    transition={{ delay: card.delay, duration: 0.8 }}
                  >
                    <div className="card shadow-lg rounded-4 hover-card border-0">
                      <div className="text-center pt-4">
                        <img
                          src={card.img || "/placeholder.svg"}
                          alt={card.title}
                          className="mx-auto"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                            transition: "all 0.5s ease",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      <div className="card-body text-center">
                        <h5
                          className="card-title fw-bold"
                          style={{ fontSize: "1.3rem", color: "#201548" }}
                        >
                          {card.title}
                        </h5>
                        <p
                          className="card-text"
                          style={{ fontSize: "1rem", color: "#0e0f0f" }}
                        >
                          {card.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-5"
          id="skincare"
          style={{ background: "#ffffff", padding: "60px 0" }}
        >
          <div className="container">
            <div className="row align-items-center py-5">
              <motion.div
                className="col-md-6 text-center mb-4 mb-md-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8 }}
              >
                <div
                  className="position-relative d-flex justify-content-center"
                  style={{ height: "400px" }}
                >
                  <motion.div
                    className="position-absolute img-wrapper"
                    style={{ top: "0", left: "0" }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src="https://plus.unsplash.com/premium_photo-1674739375749-7efe56fc8bbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2tpbiUyMGNhcmV8ZW58MHx8MHx8fDA%3D"
                      alt="Skincare Services 1"
                      className="img-fluid rounded shadow custom-img"
                      style={{
                        width: "300px",
                        height: "362px",
                        objectFit: "cover",
                        borderRadius: "15px",
                        border: "2px solid #201548",
                        boxShadow: "0 10px 20px rgba(32, 21, 72, 0.2)",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="position-absolute img-wrapper"
                    style={{ top: "40px", left: "80px" }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src="https://healthwire.pk/wp-content/uploads/2022/06/skin-care-tips-for-summer.jpg"
                      alt="Skincare Services 2"
                      className="img-fluid rounded shadow custom-img"
                      style={{
                        width: "300px",
                        height: "362px",
                        objectFit: "cover",
                        borderRadius: "15px",
                        border: "2px solid #201548",
                        boxShadow: "0 10px 20px rgba(32, 21, 72, 0.2)",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="position-absolute img-wrapper"
                    style={{ top: "80px", left: "160px" }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src="https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Skincare Services 3"
                      className="img-fluid rounded shadow custom-img"
                      style={{
                        width: "300px",
                        height: "362px",
                        objectFit: "cover",
                        borderRadius: "15px",
                        border: "2px solid #201548",
                        boxShadow: "0 10px 20px rgba(32, 21, 72, 0.2)",
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="col-md-6 text-start"
                initial={{ opacity: 0, x: 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2
                  className="section-title mb-3"
                  style={{ textAlign: "left" }}
                >
                  Radiant Skincare
                </h2>
                <h3 className="fw-bold mb-4" style={{ color: "#0e0f0f" }}>
                  Transform your skin with Beauty Bliss
                </h3>
                <p className="lead mb-4" style={{ color: "#0e0f0f" }}>
                  At Beauty Bliss, our expert skincare treatments rejuvenate and
                  nourish your skin, helping you achieve a flawless, glowing
                  complexion with personalized care.
                </p>
                <ul className="list-unstyled">
                  <motion.li
                    className="d-flex align-items-start mb-3"
                    initial={{ opacity: 0, x: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                      color: "black",
                      padding: "12px 15px",
                      borderRadius: "8px",
                      border: "1px solid rgba(32, 21, 72, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                    whileHover={{
                      boxShadow: "0 5px 15px rgba(32, 21, 72, 0.1)",
                      translateY: -3,
                    }}
                  >
                    <span
                      style={{
                        color: "#201548",
                        marginRight: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      ✔️
                    </span>
                    Customized facials tailored to your skin type
                  </motion.li>
                  <motion.li
                    className="d-flex align-items-start mb-3"
                    initial={{ opacity: 0, x: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{
                      color: "black",
                      padding: "12px 15px",
                      borderRadius: "8px",
                      border: "1px solid rgba(32, 21, 72, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                    whileHover={{
                      boxShadow: "0 5px 15px rgba(32, 21, 72, 0.1)",
                      translateY: -3,
                    }}
                  >
                    <span
                      style={{
                        color: "#201548",
                        marginRight: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      ✔️
                    </span>
                    Advanced treatments for lasting hydration
                  </motion.li>
                  <motion.li
                    className="d-flex align-items-start mb-3"
                    initial={{ opacity: 0, x: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    style={{
                      color: "black",
                      padding: "12px 15px",
                      borderRadius: "8px",
                      border: "1px solid rgba(32, 21, 72, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                    whileHover={{
                      boxShadow: "0 5px 15px rgba(32, 21, 72, 0.1)",
                      translateY: -3,
                    }}
                  >
                    <span
                      style={{
                        color: "#201548",
                        marginRight: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      ✔️
                    </span>
                    Natural products for a healthy, radiant glow
                  </motion.li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {enquiryModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <motion.div
            ref={modalRef}
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
                Service Enquiry
              </h3>
              <button
                className="btn border-0"
                onClick={() => setEnquiryModalOpen(false)}
                style={{ color: "#201548" }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="serviceProvider"
                className="form-label fw-semibold text-dark"
              >
                Select Service Provider
              </label>
              <select
                id="serviceProvider"
                className="form-select"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
              >
                <option value="" disabled>
                  -- Select a service provider --
                </option>
                {serviceProviders.map((provider) => (
                  <option key={provider._id} value={provider.email}>
                    {provider.shopName} - {provider.designation} (Rating:{" "}
                    {provider.spRating})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="enquiryMessage"
                className="form-label fw-semibold text-dark"
              >
                Your Message
              </label>
              <textarea
                id="enquiryMessage"
                className="form-control"
                rows="5"
                placeholder="Please describe what services you're interested in..."
                value={enquiryMessage}
                onChange={(e) => setEnquiryMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="d-flex gap-3 justify-content-end">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setEnquiryModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{
                  backgroundColor: "#201548",
                  color: "white",
                  transition: "all 0.3s ease",
                }}
                onClick={handleSubmitEnquiry}
              >
                Submit Enquiry
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
