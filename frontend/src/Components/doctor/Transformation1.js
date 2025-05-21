import React, { useState } from "react";
import { Box, Slider, Typography, Button } from "@mui/material";
import beforehair from "../Assets/before.png";
import afterhair from "../Assets/after.png";
import beforeskin from "../Assets/beforeskin.jpg";
import afterskin from "../Assets/afterskin.png";

const Transformation = () => {
  const [hairSliderPosition, setHairSliderPosition] = useState(50);
  const [skinSliderPosition, setSkinSliderPosition] = useState(50);

  // Smooth slider movement
  const handleHairSliderChange = (e, newValue) => {
    setHairSliderPosition(newValue);
  };

  const handleSkinSliderChange = (e, newValue) => {
    setSkinSliderPosition(newValue);
  };

  return (
    <Box
      sx={{
        background: "#ffffff",
        minHeight: "100vh",
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 4 },
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
      }}
    >
      <style>
        {`
          /* Heading style */
          .title-text {
            background: linear-gradient(45deg, #201548, #36257d, #201548);
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradientShift 4s infinite ease-in-out;
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Sparkle burst for buttons */
          .transform-button {
            position: relative;
            overflow: hidden;
            animation: pulse 2s ease-in-out 2;
          }

          .transform-button .sparkle-after,
          .transform-button .sparkle-before {
            content: '✨';
            position: absolute;
            font-size: 14px;
            opacity: 0;
            animation: sparkleBurst 2s infinite ease-in-out;
          }

          .transform-button .sparkle-after {
            top: -8px;
            right: -8px;
            animation-delay: 0s;
          }

          .transform-button .sparkle-before {
            bottom: -8px;
            left: -8px;
            animation-delay: 0.5s;
            font-size: 12px;
          }

          @keyframes sparkleBurst {
            0%, 100% { opacity: 0; transform: scale(0.6) translate(0, 0); }
            50% { opacity: 1; transform: scale(1.3) translate(-2px, -2px); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
          }

          /* Gradient border for buttons */
          .transform-button {
            background: transparent;
            border: 1.5px solid transparent;
            border-image: linear-gradient(45deg, #201548, #36257d) 1;
            transition: all 0.3s ease;
            -webkit-font-smoothing: antialiased;
            font-smooth: antialiased;
          }

          .transform-button:hover {
            border-image: linear-gradient(45deg, #36257d, #201548) 1;
            background: linear-gradient(45deg, rgba(32, 21, 72, 0.08), rgba(54, 37, 125, 0.08));
            box-shadow: 0 3px 8px rgba(32, 21, 72, 0.15);
          }

          .transform-button:hover .transform-button-text {
            background: linear-gradient(45deg, #36257d, #201548);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          /* Transformations container */
          .transformations-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2.5rem;
            max-width: 1100px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
            padding: 0 1rem;
          }

          @media (min-width: 768px) {
            .transformations-container {
              grid-template-columns: 1fr 1fr;
            }
            .transformation-item:nth-child(1) {
              margin-top: 3rem;
            }
            .transformation-item:nth-child(2) {
              margin-top: 0;
            }
          }

          .transformation-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 90vw;
            opacity: 1;
            position: relative;
          }

          @media (min-width: 768px) {
            .transformation-item {
              max-width: 500px;
            }
          }

          /* Gradient overlay */
          .card-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to top, rgba(59, 26, 90, 0.1), transparent);
            border-radius: 20px;
            z-index: 1;
            pointer-events: none;
          }

          /* Slider dashed line */
          .slider-line {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(
              180deg,
              #201548 6px,
              transparent 6px,
              transparent 10px
            );
            background-size: 100% 10px;
            box-shadow: 0 0 12px rgba(32, 21, 72, 0.7);
            transform: translateX(-50%);
            z-index: 2;
            transition: left 0.3s ease-out;
            pointer-events: none;
          }

          /* Slider handle */
          .slider-handle {
            position: absolute;
            top: 50%;
            width: 16px;
            height: 16px;
            background: #ffffff;
            border: 2px solid #201548;
            border-radius: 4px;
            box-shadow: 0 0 12px rgba(32, 21, 72, 0.7);
            transform: translate(-50%, -50%);
            z-index: 3;
            transition: left 0.3s ease-out, transform 0.3s ease-out;
            cursor: ew-resize;
          }

          .slider-handle:hover {
            transform: translate(-50%, -50%) scale(1.2);
          }

          .slider-handle:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(32, 21, 72, 0.3);
          }

          /* Responsive adjustments */
          @media (max-width: 600px) {
            .transformation-item {
              max-width: 90vw;
            }
            .slider-handle {
              width: 14px;
              height: 14px;
            }
            .slider-line {
              width: 3px;
            }
          }
        `}
      </style>

      {/* Heading with container */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={3}
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
          className="title-text animate__animated animate__fadeInDown"
          style={{
            animationDuration: "0.8s",
            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Our Transformations
        </h2>
      </Box>

      {/* Transformations grid container */}
      <Box className="transformations-container">
        {/* Hair Transformation */}
        <Box className="transformation-item" style={{ "--index": 0 }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: 2,
              color: "#3b1a5a",
              fontWeight: 700,
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
            }}
          >
            Hair Transformation
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: "90vw", sm: "500px" },
              borderRadius: "20px",
              touchAction: "none",
              padding: { xs: "12px", sm: "20px" },
              boxShadow: "0 10px 25px rgba(59, 26, 90, 0.1)",
              background: "linear-gradient(to bottom, #ffffff, #fff3f7)",
            }}
          >
            <Box className="card-overlay" />
            <Box
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: "15px",
                aspectRatio: "4/3",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={afterhair}
                alt="After Hair"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                  userSelect: "none",
                  pointerEvents: "none",
                  borderRadius: "15px",
                  display: "block",
                }}
              />
              <Box
                component="img"
                src={beforehair}
                alt="Before Hair"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                  clipPath: `inset(0 ${100 - hairSliderPosition}% 0 0)`,
                  transition: "clip-path 0.3s ease-out",
                  userSelect: "none",
                  pointerEvents: "none",
                  borderRadius: "15px",
                  display: "block",
                }}
              />
              <Box
                className="slider-line"
                sx={{
                  left: `${hairSliderPosition}%`,
                }}
              />
              <Box
                className="slider-handle"
                sx={{
                  left: `${hairSliderPosition}%`,
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    setHairSliderPosition((prev) => Math.max(0, prev - 5));
                  } else if (e.key === "ArrowRight") {
                    setHairSliderPosition((prev) => Math.min(100, prev + 5));
                  }
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "8px",
                  left: "12px",
                  backgroundColor: "rgba(32, 21, 72, 0.7)",
                  color: "#ffffff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                  zIndex: 4,
                  backdropFilter: "blur(4px)",
                  fontFamily: "'Poppins', sans-serif",
                  transform: "skew(-10deg)",
                }}
              >
                Before
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: "8px",
                  right: "12px",
                  backgroundColor: "rgba(32, 21, 72, 0.7)",
                  color: "#ffffff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                  zIndex: 4,
                  backdropFilter: "blur(4px)",
                  fontFamily: "'Poppins', sans-serif",
                  transform: "skew(10deg)",
                }}
              >
                After
              </Box>
              <Slider
                value={hairSliderPosition}
                onChange={handleHairSliderChange}
                min={0}
                max={100}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  zIndex: 3,
                  cursor: "ew-resize",
                  "& .MuiSlider-thumb": { display: "none" },
                  "& .MuiSlider-track": { display: "none" },
                  "& .MuiSlider-rail": { display: "none" },
                }}
              />
            </Box>
            <Typography
              sx={{
                textAlign: "center",
                mt: 2,
                mb: 1,
                color: "#2d2d2d",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: 1.5,
              }}
            >
              Achieve vibrant, healthy hair with our expert treatments tailored to your needs.
            </Typography>
            <Box
              sx={{
                mb: 2,
                textAlign: "left",
                color: "#2d2d2d",
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "13px", sm: "14px" },
                lineHeight: 1.6,
              }}
            >
              <Typography component="ul" sx={{ listStyle: "none", p: 0 }}>
                <li>✓ Restores shine and volume</li>
                <li>✓ Strengthens hair follicles</li>
                <li>✓ Reduces breakage and split ends</li>
              </Typography>
            </Box>
          
          </Box>
        </Box>

        {/* Skin Transformation */}
        <Box className="transformation-item" style={{ "--index": 1 }}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: 2,
              color: "#3b1a5a",
              fontWeight: 700,
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
            }}
          >
            Skin Transformation
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: "90vw", sm: "500px" },
              borderRadius: "20px",
              touchAction: "none",
              padding: { xs: "12px", sm: "20px" },
              boxShadow: "0 10px 25px rgba(59, 26, 90, 0.1)",
              background: "linear-gradient(to bottom, #ffffff, #fff3f7)",
            }}
          >
            <Box className="card-overlay" />
            <Box
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: "15px",
                aspectRatio: "4/3",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={afterskin}
                alt="After Skin"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                  userSelect: "none",
                  pointerEvents: "none",
                  borderRadius: "15px",
                  display: "block",
                }}
              />
              <Box
                component="img"
                src={beforeskin}
                alt="Before Skin"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                  clipPath: `inset(0 ${100 - skinSliderPosition}% 0 0)`,
                  transition: "clip-path 0.3s ease-out",
                  userSelect: "none",
                  pointerEvents: "none",
                  borderRadius: "15px",
                  display: "block",
                }}
              />
              <Box
                className="slider-line"
                sx={{
                  left: `${skinSliderPosition}%`,
                }}
              />
              <Box
                className="slider-handle"
                sx={{
                  left: `${skinSliderPosition}%`,
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    setSkinSliderPosition((prev) => Math.max(0, prev - 5));
                  } else if (e.key === "ArrowRight") {
                    setSkinSliderPosition((prev) => Math.min(100, prev + 5));
                  }
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "8px",
                  left: "12px",
                  backgroundColor: "rgba(32, 21, 72, 0.7)",
                  color: "#ffffff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                  zIndex: 4,
                  backdropFilter: "blur(4px)",
                  fontFamily: "'Poppins', sans-serif",
                  transform: "skew(-10deg)",
                }}
              >
                Before
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: "8px",
                  right: "12px",
                  backgroundColor: "rgba(32, 21, 72, 0.7)",
                  color: "#ffffff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                  zIndex: 4,
                  backdropFilter: "blur(4px)",
                  fontFamily: "'Poppins', sans-serif",
                  transform: "skew(10deg)",
                }}
              >
                After
              </Box>
              <Slider
                value={skinSliderPosition}
                onChange={handleSkinSliderChange}
                min={0}
                max={100}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  zIndex: 3,
                  cursor: "ew-resize",
                  "& .MuiSlider-thumb": { display: "none" },
                  "& .MuiSlider-track": { display: "none" },
                  "& .MuiSlider-rail": { display: "none" },
                }}
              />
            </Box>
            <Typography
              sx={{
                textAlign: "center",
                mt: 2,
                mb: 1,
                color: "#2d2d2d",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: 1.5,
              }}
            >
              Reveal radiant, youthful skin with our personalized skincare solutions.
            </Typography>
            <Box
              sx={{
                mb: 2,
                textAlign: "left",
                color: "#2d2d2d",
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "13px", sm: "14px" },
                lineHeight: 1.6,
              }}
            >
              <Typography component="ul" sx={{ listStyle: "none", p: 0 }}>
                <li>✓ Evens skin tone</li>
                <li>✓ Reduces fine lines</li>
                <li>✓ Enhances natural glow</li>
              </Typography>
            </Box>
            
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Transformation;