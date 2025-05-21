import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';

// Sample images (replace with actual assets)
import hairCutImg from '../Assets/haircut.jpeg';
import bridalImg from '../Assets/bridal.jpg';
import waxingImg from '../Assets/waxing.webp';
import pedicureImg from '../Assets/pedicure.jpg';
import flower3 from '../Assets/flower3.png';
import flower5 from '../Assets/flower5.png';
import bride1 from '../Assets/bride.avif';

const trialSections = [
  {
    title: 'HairCut',
    description:
      'Discover the perfect haircut with our trial session, tailored to enhance your unique style.',
    img: hairCutImg,
    flower: flower3,
    bg: 'linear-gradient(135deg, #ffffff, #f0f0f0)', // Updated background
    info: [
      'Personalized consultation to match your style.',
      'Expert stylists with years of experience.',
      'Variety of cuts: bob, layered, pixie, and more.',
      'High-quality products for lasting results.',
      'Relaxing salon atmosphere for your comfort.',
    ],
  },
  {
    title: 'Bridal',
    description:
      'Experience a trial makeup session to find the ideal bridal look for your special day.',
    img: bride1,
    flower: flower5,
    bg: 'linear-gradient(135deg, #ffffff, #f5f5f5)', // Updated background
    info: [
      'Customized makeup to enhance natural beauty.',
      'Trial session to perfect your bridal look.',
      'Skilled artists specializing in bridal styling.',
      'Long-lasting products for all-day wear.',
      'Includes hair and makeup coordination.',
    ],
  },
  {
    title: 'Waxing',
    description:
      'Try our waxing services to achieve smooth, radiant skin with a personalized approach.',
    img: waxingImg,
    flower: flower3,
    bg: 'linear-gradient(135deg, #ffffff, #f2f2f2)', // Updated background
    info: [
      'Gentle waxing for sensitive skin types.',
      'Professional techniques for minimal discomfort.',
      'Options for arms, legs, and full-body waxing.',
      'Hygienic practices with premium products.',
      'Smooth results lasting up to weeks.',
    ],
  },
  {
    title: 'Pedicure',
    description:
      'Relax with a trial pedicure session to pamper your feet and find your perfect treatment.',
    img: pedicureImg,
    flower: flower5,
    bg: 'linear-gradient(135deg, #ffffff, #f7f7f7)', // Updated background
    info: [
      'Soothing foot soak and exfoliation.',
      'Choose from spa or gel pedicure styles.',
      'Nail shaping and cuticle care included.',
      'Relaxing massage for ultimate comfort.',
      'Vibrant polish options for a polished look.',
    ],
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    navigate('/products', { state: { designation: 'Beauty_Parler', service } });
  };

  return (
    <Box
      sx={{
        overflowY: 'auto',
        px: 2,
        py: 6,
        boxSizing: 'border-box',
        background: '#ffffff', // Updated background color
      }}
    >
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
        Our Beauty Services
      </Typography>

      {/* Trial Sections */}
      {trialSections.map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <Box
            sx={{
              background: section.bg,
              borderRadius: '40px',
              p: { xs: 3, md: 6 },
              mx: 'auto',
              mt: 5,
              maxWidth: '1200px',
              position: 'relative',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 4,
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)', // Added shadow for depth
              border: '1px solid #201548', // Subtle border
            }}
          >
            <Box
              component="img"
              src={section.flower}
              alt="floral"
              sx={{ position: 'absolute', top: -60, left: -60, width: 240, zIndex: 0 }}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              style={{ zIndex: 1, flex: 1 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Playfair Display, serif',
                  color: '#201548', // Updated text color
                  fontWeight: 'bold',
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                {section.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '18px',
                  color: '#0e0f0f', // Updated text color
                  mb: 3,
                }}
              >
                {section.description}
              </Typography>
              <Box sx={{ mb: 3 }}>
                {section.info.map((line, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '16px',
                      color: '#0e0f0f', // Updated text color
                      lineHeight: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      '&:before': {
                        content: '""',
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#201548', // Updated bullet color
                        marginRight: '10px',
                      }
                    }}
                  >
                    {line}
                  </Typography>
                ))}
              </Box>
              <Button
                variant="contained"
                startIcon={<SettingsIcon />}
                onClick={() => handleServiceClick(section.title)}
                sx={{
                  background: '#201548', // Updated button color
                  color: '#ffffff', // White text color for contrast
                  fontSize: {
                    xs: '0.7rem',
                    sm: '0.85rem',
                    md: '0.9rem',
                    lg: '0.95rem',
                  },
                  px: { xs: 2, sm: 2.5, md: 3 },
                  py: { xs: 0.75, sm: 1 },
                  borderRadius: '25px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(32, 21, 72, 0.4)', // Shadow with updated color
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  minWidth: 'auto',
                  border: '1px solid #201548', // Border to match button color
                  '&:hover': {
                    background: '#17103a', // Darker shade for hover
                    transform: 'translateY(-2px)', // Slight lift effect
                    boxShadow: '0 6px 16px rgba(32, 21, 72, 0.6)', // Enhanced shadow on hover
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', // Glowing effect
                    transition: '0.4s',
                  },
                  '&:hover:before': {
                    left: '100%',
                  },
                }}
              >
                Book Now
              </Button>
            </motion.div>

            <Box
              sx={{
                position: 'relative',
                width: { xs: '80%', md: '40%' },
                maxWidth: '320px',
                aspectRatio: '3 / 4',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  width: '100%',
                  height: '100%',
                  transform: 'rotate(-6deg)',
                  backgroundColor: '#201548', // Updated shadow color
                  borderRadius: '12px', // Rounded corners
                  zIndex: 0,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 5,
                  left: 5,
                  width: '100%',
                  height: '100%',
                  transform: 'rotate(3deg)',
                  backgroundColor: 'rgba(32, 21, 72, 0.3)', // Lighter shade of the theme color
                  borderRadius: '12px', // Rounded corners
                  zIndex: 1,
                }}
              />
              <motion.img
                src={section.img}
                alt={section.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px', // Rounded corners
                  position: 'relative',
                  zIndex: 2,
                  border: '3px solid #ffffff', // White border for contrast
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </Box>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
}