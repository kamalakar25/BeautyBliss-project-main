import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,

  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const services = [
  {
    title: "Hair Treatment",
    description:
      "Specialized care for hair loss, dandruff, and scalp issues. Treatments include PRP, laser therapy, and regrowth plans.",
    image:
      "https://img.freepik.com/premium-photo/hair-treatment-procedure-with-professional-applying-serum_37732-6171.jpg?w=360",
    color: "#201548",
    bgColor: "#ffffff",
  },
  {
    title: "Skin Treatment",
    description:
      "Advanced solutions for acne, pigmentation, and anti-aging. Services include chemical peels, laser, and rejuvenation.",
    image: "https://img1.wsimg.com/isteam/stock/gYlVpPP",
    color: "#201548",
    bgColor: "#ffffff",
  },
];

const OurServices = () => {
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    navigate("/products", { state: { designation: "Doctor", service } });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#ffffff",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, sm: 6, md: 8 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>
        {`
          /* Background circles */
          .background-circles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
          }

          .circle {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(32, 21, 72, 0.15), transparent 70%);
            animation: float 10s infinite ease-in-out;
            opacity: 0.6;
          }

          .circle-1 {
            width: 200px;
            height: 200px;
            top: 10%;
            left: -10%;
            animation-delay: 0s;
          }

          .circle-2 {
            width: 150px;
            height: 150px;
            top: 60%;
            right: -5%;
            background: radial-gradient(circle, rgba(248, 247, 255, 0.3), transparent 70%);
            animation-delay: 2s;
          }

          .circle-3 {
            width: 250px;
            height: 250px;
            bottom: 5%;
            left: 20%;
            animation-delay: 4s;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0) scale(1);
              opacity: 0.6;
            }
            50% {
              transform: translateY(-20px) scale(1.1);
              opacity: 0.8;
            }
          }

          /* Card-specific collaborating circles in top-left corner */
          .card-circles {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
          }

          .card-circle {
            position: absolute;
            border-radius: 50%;
            border: 1.5px solid rgba(32, 21, 72, 0.5);
            background: radial-gradient(circle, rgba(32, 21, 72, 0.25), transparent 70%);
            animation: glow 4s infinite ease-in-out;
            opacity: 0.5;
          }

          .card-circle-1 {
            width: 70px;
            height: 70px;
            top: -20px;
            left: -20px;
            animation-delay: 0s;
            opacity: 0.6;
            background: radial-gradient(circle, rgba(32, 21, 72, 0.3), transparent 70%);
          }

          .card-circle-2 {
            width: 60px;
            height: 60px;
            top: -15px;
            left: -10px;
            background: radial-gradient(circle, rgba(248, 247, 255, 0.35), transparent 70%);
            animation-delay: 1.5s;
            opacity: 0.5;
            transform: translate(15px, 15px);
            border: 1.5px solid rgba(248, 247, 255, 0.5);
          }

          .card-circle-3 {
            width: 65px;
            height: 65px;
            top: -10px;
            left: -25px;
            background: radial-gradient(circle, rgba(54, 37, 125, 0.3), transparent 70%);
            animation-delay: 3s;
            opacity: 0.4;
            transform: translate(-10px, 10px);
            border: 1.5px solid rgba(54, 37, 125, 0.5);
          }

          @keyframes glow {
            0%, 100% {
              transform: scale(1);
              opacity: 0.4;
              box-shadow: 0 0 10px rgba(32, 21, 72, 0.2);
            }
            50% {
              transform: scale(1.15);
              opacity: 0.6;
              box-shadow: 0 0 20px rgba(32, 21, 72, 0.4);
            }
          }

          /* Services container */
          .services-container {
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 1;
          }

          .service-item {
            flex: 0 0 auto;
            width: 100%;
            max-width: 400px; /* Fixed card width */
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            animation: flipIn 0.6s ease-out forwards;
            animation-delay: calc(0.2s * var(--index));
            position: relative;
          }

          @media (min-width: 960px) {
            .service-item {
              flex: 0 0 auto;
              width: 400px; /* Consistent width for larger screens */
            }
          }

          /* Flip-in animation for cards */
          @keyframes flipIn {
            0% {
              opacity: 0;
              transform: perspective(800px) rotateY(30deg) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: perspective(800px) rotateY(0deg) translateY(0);
            }
          }

          .card {
            position: relative;
            transform: translateZ(0);
            transition: transform 0.4s ease, box-shadow 0.4s ease;
            z-index: 1;
            width: 100%;
            height: 450px; /* Fixed card height */
          }

          .card:hover {
            transform: translateY(-12px) scale(1.03);
            box-shadow: 0 16px 32px rgba(32, 21, 72, 0.2) !important;
          }

          .card-media {
            position: relative;
            overflow: hidden;
            border-radius: 12px 12px 0 0;
            height: 200px; /* Fixed media height */
          }

          .card-media::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(32, 21, 72, 0.25), transparent 70%);
            pointer-events: none;
          }

          .card-media img {
            transition: transform 0.6s ease;
            object-fit: cover;
            width: 100%;
            height: 100%;
          }

          .card:hover .card-media img {
            transform: scale(1.1);
          }

          /* Sparkle burst for buttons */
          .book-now-button {
            position: relative;
            overflow: hidden;
          }

          .book-now-button::after {
            content: '✨';
            position: absolute;
            top: -8px;
            right: -8px;
            font-size: 14px;
            opacity: 0;
            animation: sparkleBurst 2.5s infinite ease-in-out;
            animation-delay: calc(0.3s * var(--index));
          }

          @keyframes sparkleBurst {
            0%, 100% {
              opacity: 0;
              transform: scale(0.5) translate(0, 0);
            }
            50% {
              opacity: 1;
              transform: scale(1.2) translate(-4px, -4px);
            }
          }

          /* Gradient text animation for title */
          .title-text {
            background: linear-gradient(45deg, #201548, #36257d, #201548);
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradientShift 4s infinite ease-in-out;
          }

          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          /* Responsive adjustments */
          @media (max-width: 600px) {
            .service-item {
              max-width: 90vw;
              width: 100%;
            }
            .circle-1, .circle-2, .circle-3 {
              width: 120px;
              height: 120px;
            }
            .card-circle-1 {
              width: 50px;
              height: 50px;
              top: -15px;
              left: -15px;
              border: 1px solid rgba(32, 21, 72, 0.5);
            }
            .card-circle-2 {
              width: 45px;
              height: 45px;
              top: -10px;
              left: -10px;
              transform: translate(10px, 10px);
              border: 1px solid rgba(248, 247, 255, 0.5);
            }
            .card-circle-3 {
              width: 48px;
              height: 48px;
              top: -8px;
              left: -18px;
              transform: translate(-8px, 8px);
              border: 1px solid rgba(54, 37, 125, 0.5);
            }
            .card {
              height: 420px; /* Slightly shorter for mobile */
            }
            .card-media {
              height: 180px; /* Adjusted for mobile */
            }
          }
        `}
      </style>
      {/* Background circles */}
      <Box className="background-circles">
        <Box className="circle circle-1" />
        <Box className="circle circle-2" />
        <Box className="circle circle-3" />
      </Box>

      {/* Title with logo */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={0.1}
        sx={{
          background: "linear-gradient(to right, #ffffff, #f8f7ff, #ffffff)",
          py: 1.5,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(32, 21, 72, 0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2
          className="fw-bold title-text animate__animated animate__fadeInDown"
          style={{
            animationDuration: "0.8s",
            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            fontFamily: "'Playfair Display', serif",
            textAlign: "center",
          }}
        >
          Our Services
        </h2>
        <Box
          component="img"
          sx={{
            height: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            width: "auto",
            ml: 1,
          }}
        />
      </Box>

      {/* Services flex container */}
      <Box className="services-container">
        {services.map((service, index) => (
          <Box
            className="service-item"
            key={index}
            style={{ "--index": index }}
          >
            <Box className="card-circles">
              <Box className="card-circle card-circle-1" />
              <Box className="card-circle card-circle-2" />
              <Box className="card-circle card-circle-3" />
            </Box>
            <Card
              className="card"
              elevation={8}
              sx={{
                width: "100%",
                maxWidth: 400, // Consistent width
                height: "100%", // Fixed height
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backgroundColor: service.bgColor,
                border: "1px solid rgba(32, 21, 72, 0.05)",
              }}
            >
              <Box className="card-media">
                <CardMedia
                  component="img"
                  image={service.image}
                  alt={service.title}
                  loading="lazy"
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%", // Full height of media container
                  }}
                />
              </Box>
              <CardContent
                sx={{
                  flexGrow: 1,
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  background: "linear-gradient(to top, #ffffff, #f8f7ff 80%)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: service.color,
                    mb: 1,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: { xs: "1.4rem", sm: "1.6rem" },
                    textAlign: "center",
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#0e0f0f",
                    mb: 2,
                    fontSize: { xs: "0.9rem", sm: "0.95rem" },
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: 1.6,
                    textAlign: "center",
                    flexGrow: 1, // Ensure description takes available space
                  }}
                >
                  {service.description}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleServiceClick(service.title)}
                  className="book-now-button"
                  sx={{
                    backgroundColor: "#201548",
                    color: "#ffffff",
                    padding: { xs: "0.8rem 2.5rem", sm: "0.9rem 3rem" },
                    borderRadius: "10px",
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    fontWeight: 500,
                    fontFamily: "'Poppins', sans-serif",
                    width: "fit-content",
                    marginTop: "auto",
                    alignSelf: "center",
                    textTransform: "none",
                    position: "relative",
                    transition: "background-color 0.3s ease, transform 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#36257d",
                      transform: "scale(1.08)",
                    },
                  }}
                  aria-label={`View more about ${service.title}`}
                  title={`View more about ${service.title}`}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OurServices;