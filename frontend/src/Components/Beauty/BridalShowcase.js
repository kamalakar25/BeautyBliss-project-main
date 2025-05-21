import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const artists = [
  {
    name: "Sunitha Shetty",
    experience: 10,
    description: [
      "Specializes in bridal and glam makeup artistry",
      "Creates stunning looks for weddings and special events",
      "Expert in enhancing natural beauty",
      "Known for long-lasting makeup applications",
      "Brings elegance to every client's appearance",
    ],
    image:
      "https://nikky-bawa.in/wp-content/uploads/2024/04/Bridal-Makeup-Looks.jpg",
  },
  {
    name: "Likitha Gowda",
    experience: 8,
    description: [
      "Renowned for editorial and avant-garde styles",
      "Creates bold runway looks for fashion shows",
      "Master of innovative makeup techniques",
      "Works with top fashion photographers",
      "Pushes boundaries in creative expression",
    ],
    image:
      "https://images.herzindagi.info/image/2023/Nov/bridal-makeup-trend.jpg",
  },
  {
    name: "Eshwari Madhav",
    experience: 6,
    description: [
      "Expert in natural, glowing skin finishes",
      "Perfects looks for photoshoots and portraits",
      "Focuses on subtle enhancement techniques",
      "Creates flawless, camera-ready makeup",
      "Specializes in dewy, radiant appearances",
    ],
    image:
      "https://www.o3plus.com/cdn/shop/articles/The_Ultimate_Bridal_Glow.png?v=1739108575",
  },
  {
    name: "Nikitha Samudrala",
    experience: 7,
    description: [
      "Blends bold colors for unique designs",
      "Creates striking, artistic makeup styles",
      "Known for creative and vibrant looks",
      "Excels in experimental color combinations",
      "Brings personality to every creation",
    ],
    image:
      "https://media.istockphoto.com/id/1340302535/photo/beautiful-indian-woman-getting-ready-to-a-wedding-reception-at-the-beauty-parlor.jpg?s=612x612&w=0&k=20&c=GzhivtaqLIDXBQ69R0DlIOfwY4aOYUI67gxWKTM3ooA=",
  },
  {
    name: "Anitha Nagaraj",
    experience: 12,
    description: [
      "Master of special effects makeup",
      "Creates cinematic and theatrical looks",
      "Skilled in prosthetics and transformations",
      "Works on film and TV productions",
      "Expert in character-driven artistry",
    ],
    image:
      "https://www.frenchweddingstyle.com/wp-content/uploads/2024/07/theatre-of-real-life-photographer-french-wedding-style-.jpg",
  },
];

const BridalShowcase = () => {
  const [index, setIndex] = useState(0);

  const nextArtist = () => setIndex((prev) => (prev + 1) % artists.length);
  const prevArtist = () =>
    setIndex((prev) => (prev - 1 + artists.length) % artists.length);

  return (
    <Box
      sx={{
        overflowX: "hidden",
        overflowY: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 6, sm: 8 },
        boxSizing: "border-box",
        background: "#f7f4ff",
        minHeight: "100vh",
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle, rgba(106, 78, 156, 0.08) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          opacity: 0.3,
        },
      }}
    >
      {/* Makeup Artists Carousel */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          p: { xs: 2, sm: 3 },
          position: "relative",
        }}
      >
        <style>
          {`
            h2.text-primary {
              font-family: 'Playfair Display', serif;
              font-weight: 800;
              font-size: 3.5rem;
              background: linear-gradient(90deg, #3a2a6a, #fff);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              position: relative;
              margin-bottom: 3rem;
              text-align: center;
              letter-spacing: 3px;
              text-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
            }

            h2.text-primary::after {
              content: '';
              position: absolute;
              bottom: -18px;
              left: 50%;
              transform: translateX(-50%);
              width: 180px;
              height: 5px;
              background: linear-gradient(90deg, #3a2a6a, #fff);
              border-radius: 2.5px;
            }

            .custom-button {
              position: relative;
              border-radius: 40px;
              transition: all 0.4s ease;
              overflow: hidden;
              border: 2px solid transparent;
              background: linear-gradient(#ffffff, #ffffff) padding-box,
                          linear-gradient(90deg, #3a2a6a, #fff) border-box;
            }

            .custom-button::after {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
              transition: all 0.6s ease;
            }

            .custom-button:hover::after {
              left: 100%;
            }

            .custom-button:hover {
              transform: scale(1.1);
              box-shadow: 0 8px 25px rgba(232, 185, 35, 0.3);
            }

            .divider {
              width: 120px;
              height: 4px;
              background: linear-gradient(90deg, #3a2a6a, #fff);
              margin: 1.5rem 0;
              border-radius: 2px;
            }

            .image-container {
              border: 3px solid transparent;
              background: linear-gradient(#ffffff, #ffffff) padding-box,
                          linear-gradient(90deg, #3a2a6a,rgb(228, 228, 227)) border-box;
            }

            .experience-badge {
              position: absolute;
              bottom: 20px;
              right: 20px;
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #3a2a6a,rgb(236, 235, 230));
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-family: 'Lora', serif;
              font-size: 1rem;
              font-weight: 600;
              text-align: center;
              border: 2px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
              transition: transform 0.3s ease;
            }

            .experience-badge:hover {
              transform: rotate(10deg);
            }
          `}
        </style>
           <Typography
               variant="h4"
               sx={{
                 fontWeight: 'bold',
                 fontFamily: 'Playfair Display, serif',
                 color: '#201548', // Updated highlighted text color
                 textAlign: 'center',
                 mb: 6,
                 textTransform: 'uppercase',
                 letterSpacing: '2px',
                 position: 'relative',
                 '&:after': {
                   content: '""',
                   position: 'absolute',
                   bottom: '-15px',
                   left: '50%',
                   transform: 'translateX(-50%)',
                   width: '80px',
                   height: '3px',
                   background: '#201548', // Updated underline color
                 }
               }}
             >
             Explore Our Makeup Artists
             </Typography>
       
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: { xs: "100%", sm: "90%", md: "72rem" },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  bgcolor: "#ffffff",
                  borderRadius: "2rem",
                  boxShadow: {
                    xs: "0 15px 30px rgba(0, 0, 0, 0.15)",
                    sm: "0 25px 50px rgba(0, 0, 0, 0.1)",
                  },
                  overflow: "hidden",
                  mx: "auto",
                  border: "2px solid transparent",
                  background: "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #3a2a6a,rgb(236, 236, 236)) border-box",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    height: { xs: "300px", sm: "360px", md: "480px" },
                    flexShrink: 0,
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "2rem 0 0 2rem",
                    border: "2px solid transparent",
                    background: "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #3a2a6a,rgb(248, 248, 248)) border-box",
                    borderRight: { xs: "none", md: "none" },
                    borderBottom: { xs: "none", md: "2px solid transparent" },
                  }}
                >
                  <motion.img
                    src={
                      artists[index].image ||
                      "https://via.placeholder.com/400x480?text=No+Image"
                    }
                    alt={artists[index].name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      borderRadius: "inherit",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(180deg, rgba(58, 42, 106, 0.2), rgba(232, 185, 35, 0.1))",
                      borderRadius: "inherit",
                    }}
                  />
                  <motion.div
                    className="experience-badge"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {artists[index].experience} Years
                  </motion.div>
                </Box>
                <Box
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    p: { xs: 3, sm: 4, md: 5 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "linear-gradient(to bottom, #3a2a6a, #2a1c4a)",
                    borderRadius: "0 2rem 2rem 0",
                    border: "2px solid transparent",
                    borderLeft: { xs: "none", md: "none" },
                    borderTop: { xs: "none", md: "2px solid transparent" },
                    background: "linear-gradient(#3a2a6a, #2a1c4a) padding-box, linear-gradient(90deg, #3a2a6a,rgb(255, 254, 251)) border-box",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                      fontWeight: 700,
                      mb: 1,
                      color: "#f9f6ff",
                      fontFamily: '"Playfair Display", serif',
                      letterSpacing: "1.5px",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    {artists[index].name}
                  </Typography>
                  <Box className="divider" />
                  <Box
                    component="ul"
                    sx={{
                      pl: { xs: 2, sm: 2.5 },
                      color: "#e8e1ff",
                      fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                      mb: 4,
                      lineHeight: 2,
                      fontFamily: '"Lora", serif',
                    }}
                  >
                    {artists[index].description.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15, duration: 0.6 }}
                        style={{ marginBottom: "14px" }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 1.5, sm: 2 },
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      className="custom-button"
                      variant="outlined"
                      onClick={prevArtist}
                      sx={{
                        color: "#000",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        px: { xs: 3, sm: 4 },
                        py: 1,
                        textTransform: "none",
                        fontFamily: '"Lora", serif',
                        "&:hover": {
                          color: "#ffffff",
                          background: "linear-gradient(90deg, #3a2a6a,rgb(245, 241, 227))",
                        },
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      className="custom-button"
                      variant="contained"
                      onClick={nextArtist}
                      sx={{
                        color: "#000",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        px: { xs: 3, sm: 4 },
                        py: 1,
                        textTransform: "none",
                        fontFamily: '"Lora", serif',
                        // background: "linear-gradient(90deg,rgb(241, 241, 241), #3a2a6a)",
                      
                        "&:hover": {
                          color: "#000",
                          background: "linear-gradient(90deg,rgb(241, 241, 241), #3a2a6a)",
                      
                        },
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default BridalShowcase;