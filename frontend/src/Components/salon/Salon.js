import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Fab, IconButton, useScrollTrigger, Zoom } from "@mui/material";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  useMediaQuery,
  useTheme,
  Container,
  Divider,
} from "@mui/material";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SpaIcon from "@mui/icons-material/Spa";
import ScissorsIcon from "@mui/icons-material/ContentCut";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FaceIcon from "@mui/icons-material/Face";
import PedicureIcon from "@mui/icons-material/PedalBike";

// Import images
import Salon1 from "../Assets/salon1.jpg";
import Salon2 from "../Assets/salon2.jpg";
import Salon3 from "../Assets/salon3.webp";
import haircut from "../Assets/salon4.jpg";
import facial from "../Assets/salon5.png";
import haircolor from "../Assets/salon6.jpg";
import shaving from "../Assets/salon7.png";
import ourwork from "../Assets/salon8.webp";
import ourwork2 from "../Assets/salon9.jpg";
import ourwork3 from "../Assets/salon10.jpg";
import ourwork4 from "../Assets/salon11.jpg";
import ourwork5 from "../Assets/salon12.jpg";
import About from "../Assets/salon13.jpg";
import pedicure from "../Assets/pedicure.jpg";


const BookNowButton = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  return (
    <Zoom in={true} timeout={1500} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 20, sm: 40 },
          right: { xs: 20, sm: 40 },
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          size={isMobile ? 'small' : 'medium'}
          sx={{
            background: 'linear-gradient(135deg, #201548 0%, #3a2a6b 100%)',
            color: '#ffffff',
            fontSize: {
              xs: '0.75rem',
              sm: '0.9rem',
              md: '1rem',
            },
            px: { xs: 2.5, sm: 3 },
            py: { xs: 1, sm: 1.25 },
            borderRadius: '50px',
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '1px',
            boxShadow: '0 6px 20px rgba(32, 21, 72, 0.3)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
            overflow: 'hidden',
            minWidth: 'auto',
            border: '2px solid rgba(255,255,255,0.2)',
            '&:hover': {
              transform: 'translateY(-3px) scale(1.03)',
              boxShadow: '0 10px 25px rgba(32, 21, 72, 0.5)',
              background: 'linear-gradient(135deg, #3a2a6b 0%, #201548 100%)',
            },
            '&:after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transform: 'translateX(-100%)',
              transition: '0.6s',
            },
            '&:hover:after': {
              transform: 'translateX(100%)',
            },
          }}
          onClick={() => navigate('/products', { state: { designation: 'Salon' } })}
        >
          <BookOnlineIcon sx={{ mr: 1, fontSize: { xs: '1rem', sm: '1.2rem' } }} />
          Book Now
        </Button>
      </Box>
    </Zoom>
  );
};

const SalonPage = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Color scheme
  const colors = {
    background: "#ffffff",
    text: "#0e0f0f",
    primary: "#201548",
    secondary: "#3a2a6d",
    accent: "#5e43ba",
    lightAccent: "rgb(228, 205, 231)",
  };

  const descriptions = [
    "Revitalize your skin with our rejuvenating facial treatments, tailored to refresh and hydrate your complexion.",
    "Get the perfect look with our expert men's haircut services, designed to match your style and personality.",
    "Enhance your hair's natural beauty with our stunning balayage and highlights, creating seamless, sun-kissed looks.",
    "Transform your style with our professional women's hair coloring services, offering vibrant and lasting results.",
    "Add volume and movement to your hair with our trendy layer cuts, customized to suit your face shape and style.",
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  };

  const SalonCards = [
    {
      id: 1,
      title: "HairCut",
      icon: <ScissorsIcon fontSize="large" />,
      img: haircut,
      description:
        "Get a fresh and stylish haircut that suits your personality and enhances your look!",
    },
    {
      id: 2,
      title: "Facial",
      icon: <FaceIcon fontSize="large" />,
      img: facial,
      description:
        "Enhance your skin's natural glow with our expert facial treatments.",
    },
    {
      id: 3,
      title: "HairColor",
      icon: <ColorLensIcon fontSize="large" />,
      img: haircolor,
      description:
        "Transform your hair with our expert hair coloring services.",
    },
    {
      id: 4,
      title: "Shaving",
      icon: <ScissorsIcon fontSize="large" />,
      img: shaving,
      description:
        "Experience a smooth and clean shave with our professional shaving services.",
    },
  ];

  const images = [ourwork, ourwork2, ourwork3, ourwork4, ourwork5];

  const handleServiceClick = (service) => {
    navigate("/products", {
      state: { designation: "Salon", service: service },
    });
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      const cardWidth =
        carouselRef.current.firstChild.getBoundingClientRect().width + 16;
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      const cardWidth =
        carouselRef.current.firstChild.getBoundingClientRect().width + 16;
      carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Scroll reveal animation for floating button
  function ScrollTop({ children }) {
    const trigger = useScrollTrigger({
      threshold: 100,
    });

    const handleClick = (event) => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    return (
      <Zoom in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          {children}
        </Box>
      </Zoom>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: "'Poppins', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Hero Carousel */}
      <section>
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          showStatus={false}
          showArrows={!isMobile}
          interval={5000}
          selectedItem={activeIndex}
          onChange={setActiveIndex}
          renderIndicator={(onClickHandler, isSelected, index, label) => (
            <li
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                margin: "0 4px",
                backgroundColor: isSelected ? colors.primary : "#ccc",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              value={index}
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`Slide ${index + 1}`}
            />
          )}
        >
          {[Salon1, Salon2, Salon3].map((img, index) => (
            <Box key={index} sx={{ position: "relative" }}>
              <img
                src={img}
                alt={`Salon ${index + 1}`}
                style={{
                  width: "100%",
                  height: isMobile ? "60vh" : "70vh",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  position: "absolute",
                  bottom: "20%",
                  left: "10%",
                  textAlign: "left",
                  color: "white",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                <Typography
                  variant={isMobile ? "h4" : "h2"}
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    letterSpacing: "1px",
                  }}
                >
                  Luxury Salon Experience
                </Typography>
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{
                    maxWidth: isMobile ? "90%" : "50%",
                    lineHeight: 1.6,
                  }}
                >
                  Discover premium beauty services tailored just for you
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: colors.primary,
                    "&:hover": {
                      backgroundColor: colors.secondary,
                    },
                    px: 4,
                    py: 1.5,
                    borderRadius: "50px",
                    fontSize: isMobile ? "0.875rem" : "1rem",
                  }}
                  onClick={() => navigate("/products")}
                >
                  Book Now
                </Button>
              </motion.div> */}
            </Box>
          ))}
        </Carousel>
      </section>

      {/* Services Section */}
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          backgroundColor: "#E6DDEE",
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{
            textAlign: "center",
            marginBottom: { xs: "2rem", sm: "3rem", md: "4rem" },
          }}
        >
          <motion.div variants={fadeInUp}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },
              }}
            >
              Our Premium Services
            </Typography>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Typography
              variant="subtitle1"
              sx={{
                color: colors.text,
                maxWidth: "700px",
                margin: "0 auto",
                lineHeight: 1.6,
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                opacity: 0.9,
                marginBottom: "10px",
              }}
            >
              Experience luxury and precision with our expertly crafted services
            </Typography>
          </motion.div>
        </motion.div>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr", // 2 cards per row on mobile
              sm: "1fr 1fr", // 2 cards per row on small screens
              md: "repeat(4, 1fr)", // 4 cards per row on medium and larger
            },
            gap: { xs: 2, sm: 3, md: 4 },
            alignItems: "stretch", // Ensure all cards stretch to same height
          }}
        >
          {SalonCards.map((card, index) => (
            <motion.div
              key={card.id}
              variants={cardItem}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ display: "flex", height: "100%" }}
            >
              <Card
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  border: `1px solid ${colors.lightAccent}`,
                  backgroundColor: "rgb(228, 205, 231)",
                }}
                onClick={() => handleServiceClick(card.title)}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: "180px", sm: "220px", md: "250px" },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={card.img}
                    alt={card.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter:
                        hoveredCard === card.id
                          ? "brightness(0.7)"
                          : "brightness(0.95)",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(to top, ${colors.primary} 0%, transparent 70%)`,
                      opacity: hoveredCard === card.id ? 0.8 : 0.6,
                      transition: "all 0.3s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                      textAlign: "center",
                      width: "100%",
                      zIndex: 2,
                      px: 2,
                    }}
                  >
                    {React.cloneElement(card.icon, {
                      sx: {
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                        color: "white",
                        mb: 1,
                        transition: "all 0.3s ease",
                        transform:
                          hoveredCard === card.id ? "scale(1.2)" : "scale(1)",
                      },
                    })}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        transition: "all 0.3s ease",
                        transform:
                          hoveredCard === card.id ? "scale(1.05)" : "scale(1)",
                        fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: { xs: 2, sm: 3 },
                    backgroundColor: colors.lightAccent,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                      lineHeight: 1.5,
                      flexGrow: 1,
                    }}
                  >
                    {card.description}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: colors.primary,
                      color: "white",
                      borderRadius: "50px",
                      px: { xs: 2, sm: 3 },
                      py: 1,
                      alignSelf: "flex-start",
                      "&:hover": {
                        backgroundColor: colors.secondary,
                      },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      minWidth: { xs: "100px", sm: "120px" },
                    }}
                  >
                    View More
                  </Button>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* About Us Section */}
      <Box
        sx={{
          backgroundColor: "rgb(215, 232, 250)",
          py: { xs: 6, md: 10 },
          position: "relative",
          overflow: "hidden",
          borderTop: `1px solid ${colors.lightAccent}`,
          borderBottom: `1px solid ${colors.lightAccent}`,
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            // backgroundColor: `${colors.accent}10`,

            filter: "blur(40px)",
            zIndex: 0,
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "4px",
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                  borderRadius: "2px",
                },
              }}
            >
              About Our Salon
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: colors.text,
                maxWidth: "700px",
                margin: "0 auto",
                lineHeight: 1.6,
                fontSize: { xs: "1rem", md: "1.1rem" },
                opacity: 0.8,
              }}
            >
              Where beauty meets perfection and every visit is a transformation
            </Typography>
          </motion.div>

          {/* Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 4, md: 8 },
            }}
          >
            {/* Image */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ flex: 1, position: "relative" }}
            >
              <Box
                component="img"
                src={About}
                alt="Salon Interior"
                sx={{
                  width: "100%",
                  borderRadius: "16px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transform: { xs: "rotate(0deg)", md: "rotate(-3deg)" },
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "rotate(0deg) scale(1.02)",
                  },
                  zIndex: 2,
                  position: "relative",
                }}
              />
              {/* Decorative shape behind image */}
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: -20, md: -30 },
                  left: { xs: -20, md: -30 },
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  border: `2px solid ${colors.accent}30`,
                  zIndex: 1,
                }}
              />
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ flex: 1 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: colors.primary,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Your Personal Beauty Haven
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.8,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  color: colors.text,
                }}
              >
                Since 2010, <strong>Beauty Haven Salon</strong> has been the
                premier destination for those seeking exceptional beauty
                services in a luxurious environment. Our passion for perfection
                drives us to deliver outstanding results every time.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  lineHeight: 1.8,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  color: colors.text,
                }}
              >
                Our team of <strong>award-winning stylists</strong> and{" "}
                <strong>skincare specialists</strong>
                continuously train in the latest techniques to bring you
                cutting-edge services with timeless elegance.
              </Typography>

              {/* Features Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 3,
                  mt: 4,
                }}
              >
                {[
                  {
                    title: "Certified Experts",
                    // icon: <VerifiedUserIcon color="primary" />,
                    text: "All our professionals are fully certified and regularly trained",
                  },
                  {
                    title: "Premium Products",
                    // icon: <SpaIcon color="primary" />,
                    text: "We use only the highest quality professional products",
                  },
                  {
                    title: "Sanitized Tools",
                    // icon: <CleanHandsIcon color="primary" />,
                    text: "All equipment is sterilized after each use for your safety",
                  },
                  {
                    title: "Personalized Care",
                    // icon: <PersonIcon color="primary" />,
                    text: "Tailored services to match your unique style and needs",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        p: 2,
                        backgroundColor: `${colors.primary}08`,
                        borderRadius: "12px",
                        border: `1px solid ${colors.lightAccent}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: `${colors.primary}12`,
                          boxShadow: `0 5px 15px ${colors.accent}10`,
                        },
                      }}
                    >
                      {/* <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: `${colors.primary}15`,
                          flexShrink: 0,
                        }}
                      >
                        {feature.icon}
                      </Box> */}
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            color: colors.primary,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.text,
                            opacity: 0.9,
                            fontSize: "0.9rem",
                          }}
                        >
                          {feature.text}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              {/* CTA Button */}
              {/* <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: "2rem" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  // startIcon={<CalendarTodayIcon />}
                  sx={{
                    backgroundColor: colors.primary,
                    color: "white",
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: colors.secondary,
                      boxShadow: `0 5px 15px ${colors.accent}40`,
                    },
                  }}
                  onClick={() => navigate("/booking")}
                >
                  Book Your Appointment
                </Button>
              </motion.div> */}
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Our Work Section */}
      <Container
        maxWidth="xl"
        sx={{ py: 4, position: "relative", backgroundColor: "#E6DDEE" }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
            }}
          >
            Our Portfolio
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: colors.text,
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
              opacity: 0.8,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Browse through our gallery to see the transformations we've created
          </Typography>
        </motion.div>

        {/* Carousel Container */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            mx: "auto",
            px: { xs: 1, sm: 2, md: 6 },
            marginBottom: { xs: 6, sm: 8 },
          }}
        >
          {/* Navigation Arrows - Visible from 320px */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: { xs: 0, sm: 4 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "transparent",
              color: colors.primary,
              // boxShadow: 1,
              "&:hover": {
                backgroundColor: "white",
                transform: "translateY(-50%) scale(1.1)",
              },
              transition: "all 0.2s ease",
              width: { xs: 36, sm: 48 },
              height: { xs: 36, sm: 48 },
            }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: 0, sm: 4 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "transparent",
              color: colors.primary,
              // boxShadow: 1,
              "&:hover": {
                backgroundColor: "white",
                transform: "translateY(-50%) scale(1.1)",
              },
              transition: "all 0.2s ease",
              width: { xs: 36, sm: 48 },
              height: { xs: 36, sm: 48 },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>

          {/* Carousel Items */}
          <Box
            ref={carouselRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              gap: { xs: 1, sm: 2 },
              py: 1,
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {images.map((img, index) => (
              <Box
                key={index}
                sx={{
                  flex: "0 0 auto",
                  width: { xs: "85vw", sm: "50vw", md: "30vw" },
                  minWidth: { xs: "85vw", sm: "50vw", md: "30vw" },
                  scrollSnapAlign: "center",
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={img}
                  alt={`Work ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: { xs: "250px", sm: "300px", md: "400px" },
                    objectFit: "cover",
                    filter: "brightness(0.95)",
                    transition: "filter 0.3s ease",
                    "&:hover": {
                      filter: "brightness(1)",
                    },
                  }}
                />
                {/* Caption that appears on hover */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                    color: "white",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    {
                      [
                        "Hair Styling",
                        "Makeover",
                        "Color Treatment",
                        "Spa Day",
                        "Complete Makeover",
                      ][index]
                    }
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    {descriptions[index].substring(0, 80)}...
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Indicators with Active Status */}
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              mt: 2,
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={() => {
                  const cardWidth =
                    carouselRef.current.firstChild.getBoundingClientRect()
                      .width + 12;
                  carouselRef.current.scrollTo({
                    left: index * cardWidth,
                    behavior: "smooth",
                  });
                }}
                sx={{
                  width: { xs: "8px", sm: "10px" },
                  height: { xs: "8px", sm: "10px" },
                  borderRadius: "50%",
                  backgroundColor:
                    activeIndex === index ? colors.primary : colors.lightAccent,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: activeIndex === index ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </Box> */}
          {/* Active Status Display */}
          {/* <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              mt: 1,
              color: colors.text,
              opacity: 0.7,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {activeIndex + 1} of {images.length}
          </Typography> */}
        </Box>
      </Container>

      {/* CTA Section */}
      {/* <Box
        sx={{
          backgroundColor: colors.primary,
          color: "white",
          py: 8,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              Ready for Your Transformation?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
              }}
            >
              Book your appointment today and experience luxury beauty care
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<BookOnlineIcon />}
              sx={{
                backgroundColor: "white",
                color: colors.primary,
                px: 5,
                py: 1.5,
                borderRadius: "50px",
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: colors.lightAccent,
                },
              }}
              onClick={() => navigate("/products")}
            >
              Book Now
            </Button>
          </motion.div>
        </Container>
      </Box> */}

      {/* Book Now Floating Button */}
 

      <BookNowButton />
    </Box>
  );
};

export default SalonPage;
