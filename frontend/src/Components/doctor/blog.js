import React, { useState } from 'react';
import {
  Container, Card, CardMedia, CardContent, Typography,
  Box, Chip, Modal, Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '80%', md: '70%', lg: '60%' }, // Increased width on xs for better fit
  maxWidth: 800,
  bgcolor: '#ffffff',
  borderRadius: { xs: '8px', sm: '12px' }, // Smaller radius on xs
  boxShadow: '0 8px 25px rgba(32, 21, 72, 0.1)',
  p: { xs: 2, sm: 4 }, // Reduced padding on xs
  outline: 'none',
  maxHeight: { xs: '85vh', sm: '90vh' }, // Slightly reduced maxHeight on xs
  overflowY: 'auto',
};

// Blog data
const blogPosts = [
  {
    id: 1,
    title: 'Top Hair Care Tips by Experts',
    category: 'Hair Care',
    points: [
      'Trim regularly to prevent split ends',
      'Use deep conditioning weekly',
      'Massage scalp for better circulation',
      'Limit heat styling to protect hair'
    ],
    description: "Maintaining healthy hair requires consistent care. Regular trims every 6-8 weeks prevent split ends from traveling up the hair shaft. Deep conditioning treatments restore moisture, especially for chemically treated or heat-styled hair. Scalp massages stimulate blood flow, promoting hair growth. Minimizing heat tools and using heat protectant sprays can significantly reduce damage.",
    image: 'https://img.freepik.com/free-photo/woman-doing-herself-scalp-massage_23-2151228494.jpg',
  },
  {
    id: 2,
    title: 'Dermatologist-Approved Skincare Routine',
    category: 'Skincare',
    points: [
      'Cleanse gently twice daily',
      'Moisturize to lock in hydration',
      'Apply sunscreen every morning',
      'Use serums at night for repair'
    ],
    description: "A proper skincare routine forms the foundation of healthy skin. Morning cleansing removes overnight buildup without stripping natural oils. Moisturizers help maintain the skin's moisture barrier. Daily SPF 30+ sunscreen is non-negotiable for preventing premature aging. Nighttime is ideal for active ingredients like retinol or peptides that work while you sleep.",
    image: 'https://img.freepik.com/free-photo/front-view-woman-applying-face-cream_23-2148708051.jpg',
  },
  {
    id: 3,
    title: 'Top Natural Oils for Healthy Skin',
    category: 'Skincare',
    points: [
      'Jojoba oil balances skin',
      'Argan oil hydrates deeply',
      'Rosehip oil reduces scars',
      'Coconut oil soothes irritation'
    ],
    description: "Natural oils can be powerful skincare allies. Jojoba oil closely resembles human sebum, making it ideal for all skin types. Argan oil's high vitamin E content provides deep hydration. Rosehip oil contains trans-retinoic acid to improve skin texture and reduce scarring. Coconut oil has anti-inflammatory properties but should be used cautiously on acne-prone skin.",
    image: 'https://img.freepik.com/free-photo/spa-composition-with-natural-oils_23-2148578912.jpg',
  },
  {
    id: 4,
    title: 'Best Anti-Aging Skincare Products',
    category: 'Skincare',
    points: [
      'Retinol boosts cell turnover',
      'Vitamin C brightens skin',
      'Hyaluronic acid plumps skin',
      'Peptides firm and tighten'
    ],
    description: "Effective anti-aging combines multiple actives. Retinol (vitamin A) accelerates cell renewal and collagen production. Vitamin C is a powerful antioxidant that brightens and protects against environmental damage. Hyaluronic acid can hold 1000x its weight in water for instant plumping. Peptides signal skin to produce more collagen for long-term firming effects.",
    image: 'https://img.freepik.com/free-photo/top-view-gua-sha-face-products_23-2149401501.jpg',
  },
  {
    id: 5,
    title: 'Hair Transplant: What to Expect',
    category: 'Hair Treatment',
    points: [
      'Consult with a specialist',
      'Prepare for minor surgery',
      'Recover in 7–10 days',
      'See results in 6–12 months'
    ],
    description: "Hair transplantation has become a refined procedure. The consultation evaluates donor hair availability and sets realistic expectations. Modern FUE techniques extract individual follicles for natural-looking results. Initial recovery involves minor scabbing that heals within days. Transplanted hairs shed before regrowing permanently, with full results visible after a year.",
    image: 'https://img.freepik.com/free-photo/man-getting-hair-loss-treatment_23-2149152760.jpg',
  },
  {
    id: 6,
    title: 'Foods That Boost Hair and Skin Health',
    category: 'Nutrition',
    points: [
      'Eat fatty fish for omega-3s',
      'Add nuts for vitamin E',
      'Include greens for antioxidants',
      'Avocados support skin hydration'
    ],
    description: "Nutrition significantly impacts hair and skin quality. Omega-3 fatty acids in salmon reduce inflammation that can trigger hair loss. Almonds provide vitamin E to protect skin from oxidative stress. Dark leafy greens deliver antioxidants like lutein for skin elasticity. Avocados offer healthy fats and vitamin C for collagen synthesis and hydration.",
    image: 'https://img.freepik.com/free-photo/flat-lay-delicious-food-arrangement_23-2149235837.jpg',
  }
];

// Single card style
const cardStyle = {
  sx: {
    borderRadius: '12px',
    background: 'linear-gradient(to top, #ffffff, #f8f7ff 80%)',
    boxShadow: '0 8px 25px rgba(32, 21, 72, 0.1)',
    width: '100%',
    maxWidth: 400,
    minHeight: 350,
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'transform 0.6s ease, box-shadow 0.6s ease',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: '0 12px 30px rgba(32, 21, 72, 0.15)',
    },
  },
  imageSx: {
    height: 220,
    borderRadius: '12px 12px 0 0',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
  },
  contentSx: {
    flexGrow: 1,
    p: 2.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'center',
    position: 'relative',
  },
};

// Modal content animation variants
const modalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, y: 50, transition: { duration: 0.4, ease: 'easeIn' } }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
};

// Blog Cards component
const BlogCardsWithDropdown = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPost(null);
  };

  return (
    <Box sx={{
      background: '#ffffff',
      py: 8,
      minHeight: '100vh',
      px: { xs: 1.5, sm: 3, md: 5 },
    }}>
      <style>
        {`
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
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Description container with door animation */
          .description-container {
            position: relative;
            height: 0;
            opacity: 0;
            overflow: hidden;
            transition: height 0.8s ease-in-out, opacity 0.8s ease-in-out;
          }

          .blog-card:hover .description-container {
            height: 150px;
            opacity: 1;
          }

          .description-container::before,
          .description-container::after {
            content: '';
            position: absolute;
            top: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(to bottom, #201548, #36257d);
            transition: transform 0.8s ease-in-out;
            z-index: 1;
          }

          .description-container::before {
            left: 0;
            transform: translate(0, 0);
          }

          .description-container::after {
            right: 0;
            transform: translate(0, 0);
          }

          .blog-card:hover .description-container::before {
            transform: translate(-100%, 100%);
          }

          .blog-card:hover .description-container::after {
            transform: translate(100%, 100%);
          }

          /* Description points */
          .description-points {
            position: relative;
            z-index: 2;
            padding: 8px 0;
          }

          /* Chevron cue */
          .chevron-cue {
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            color: #201548;
            opacity: 0.7;
            animation: pulseCue 2s infinite ease-in-out;
            transition: opacity 0.6s ease;
          }

          .blog-card:hover .chevron-cue {
            opacity: 0;
          }

          @keyframes pulseCue {
            0%, 100% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.2); }
          }
        `}
      </style>

      <Container sx={{ py: 4 }}>
        {/* Heading with styles from OurServices */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
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
              Hair & Skincare Blog
            </h2>
          </Box>
        </motion.div>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 4,
        }}>
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="blog-card"
              sx={{
                ...cardStyle.sx,
                '&:hover .card-image': {
                  transform: 'scale(1.05)',
                },
                '&:hover .card-title': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => handleOpenModal(post)}
            >
              <CardMedia
                component="img"
                className="card-image"
                sx={cardStyle.imageSx}
                image={post.image}
                alt={post.title}
              />
              <CardContent sx={cardStyle.contentSx}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Chip
                    label={post.category}
                    size="small"
                    sx={{
                      backgroundColor: '#201548',
                      color: '#ffffff',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#36257d',
                      },
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  component="div"
                  className="card-title"
                  sx={{
                    fontWeight: 700,
                    color: '#201548',
                    mb: 2,
                    fontFamily: "'Playfair Display', serif",
                    minHeight: 60,
                    transition: 'transform 0.6s ease',
                  }}
                >
                  {post.title}
                </Typography>
                <Box className="description-container">
                  <motion.div
                    className="description-points"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
                  >
                    {post.points.map((point, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: '#0e0f0f',
                          fontSize: '0.95rem',
                          fontFamily: "'Poppins', sans-serif",
                          mb: 1,
                        }}
                      >
                        {point}
                      </Typography>
                    ))}
                  </motion.div>
                </Box>
                <ExpandMoreIcon
                  className="chevron-cue"
                  sx={{ fontSize: '1.5rem' }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Modal for detailed view */}
      <AnimatePresence>
        {openModal && (
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box sx={modalStyle}>
                {selectedPost && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
                      <motion.div
                        custom={0}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Typography
                          id="modal-modal-title"
                          variant="h5"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                            color: '#201548',
                            fontFamily: "'Playfair Display', serif",
                            fontSize: { xs: '1.25rem', sm: '1.5rem' }, // Smaller font on xs
                          }}
                        >
                          {selectedPost.title}
                        </Typography>
                      </motion.div>
                      <motion.div
                        custom={1}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Button
                          onClick={handleCloseModal}
                          sx={{
                            backgroundColor: '#201548',
                            color: '#ffffff',
                            borderRadius: '8px',
                            padding: { xs: '0.4rem 0.8rem', sm: '0.5rem 1rem' },
                            minWidth: 0,
                            '&:hover': {
                              backgroundColor: '#36257d',
                            },
                            fontSize: { xs: '0.9rem', sm: '1rem' }, // Smaller button on xs
                          }}
                        >
                          <CloseIcon />
                        </Button>
                      </motion.div>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, sm: 3 } }}>
                      <Box sx={{ flex: 1 }}>
                        <motion.div
                          custom={2}
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <CardMedia
                            component="img"
                            image={selectedPost.image}
                            alt={selectedPost.title}
                            sx={{
                              borderRadius: '8px',
                              width: '100%',
                              maxHeight: { xs: 200, sm: 300 }, // Reduced height on xs
                              objectFit: 'cover',
                            }}
                          />
                        </motion.div>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <motion.div
                          custom={3}
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Chip
                            label={selectedPost.category}
                            size="medium"
                            sx={{
                              backgroundColor: '#201548',
                              color: '#ffffff',
                              fontWeight: 600,
                              mb: 2,
                              fontSize: { xs: '0.8rem', sm: '0.9rem' }, // Smaller chip on xs
                              '&:hover': {
                                backgroundColor: '#36257d',
                              },
                            }}
                          />
                        </motion.div>
                        <motion.div
                          custom={4}
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Typography
                            id="modal-modal-description"
                            sx={{
                              mt: 2,
                              color: '#0e0f0f',
                              lineHeight: 1.6,
                              mb: 2,
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: { xs: '0.9rem', sm: '1rem' }, // Smaller text on xs
                            }}
                          >
                            {selectedPost.description}
                          </Typography>
                        </motion.div>
                        {selectedPost.points.map((point, idx) => (
                          <motion.div
                            key={idx}
                            custom={5 + idx}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Typography
                              sx={{
                                color: '#0e0f0f',
                                lineHeight: 1.6,
                                mb: 1,
                                fontFamily: "'Poppins', sans-serif",
                                textAlign: 'left',
                                fontSize: { xs: '0.9rem', sm: '1rem' }, // Smaller text on xs
                              }}
                            >
                              {point}
                            </Typography>
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default BlogCardsWithDropdown;