import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, useMediaQuery, Zoom } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import bannerImage from '../Assets/beauty1.png';
import BeforeMakeup from '../Assets/before.jpg';
import AfterMakeup from '../Assets/after.jpg';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

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
          onClick={() => navigate('/products', { state: { designation: 'Beauty_Parler' } })}
        >
          <BookOnlineIcon sx={{ mr: 1, fontSize: { xs: '1rem', sm: '1.2rem' } }} />
          Book Now
        </Button>
      </Box>
    </Zoom>
  );
};

const BannerSplitHover = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const isMobile = useMediaQuery('(max-width:720px)');
  const isTablet = useMediaQuery('(min-width:320px) and (max-width:1024px)');
  const leftControls = useAnimation();
  const rightControls = useAnimation();

  useEffect(() => {
    if (isMobile) {
      leftControls.set({ x: '0%' });
      rightControls.set({ x: '0%' });
    } else {
      leftControls.set({ x: '-100%' });
      rightControls.set({ x: '100%' });

      const timer = setTimeout(() => {
        leftControls.start({
          x: '0%',
          transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
        });
        rightControls.start({
          x: '0%',
          transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isMobile, leftControls, rightControls]);

  const handleMouseEnter = () => {
    if (isMobile) return;
    setHovered(true);
    leftControls.start({ x: '-100%', transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } });
    rightControls.start({ x: '100%', transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setHovered(false);
    leftControls.start({ x: '0%', transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } });
    rightControls.start({ x: '0%', transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } });
  };

  const handleClick = () => {
    if (!isTablet) return;
    const isOpen = hovered;
    setHovered(!isOpen);
    leftControls.start({
      x: isOpen ? '0%' : '-100%',
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
    });
    rightControls.start({
      x: isOpen ? '0%' : '100%',
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
    });
  };

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <Box sx={{ 
      overflowX: 'hidden', 
      width: '100%', 
      maxWidth: '100vw', 
      backgroundColor: '#ffffff',
      backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(245, 243, 255, 0.8) 0%, rgba(255,255,255,1) 50%)'
    }}>
      {/* Banner Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 220, sm: 300, md: 380, lg: 480, xl: 560 },
          width: '90%',
          maxWidth: '1400px',
          mt: { xs: 3, sm: 4 },
          mx: 'auto',
          borderRadius: { xs: '16px', md: '24px' },
          overflow: 'hidden',
          boxShadow: '0 30px 60px -20px rgba(32, 21, 72, 0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            border: '1px solid rgba(32, 21, 72, 0.1)',
            pointerEvents: 'none',
            zIndex: 10
          }
        }}
      >
        {/* Text Content */}
        <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.2, ease: 'easeOut' }}
>
  <Box
    sx={{
      position: 'absolute',
      zIndex: 3,
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      pointerEvents: 'none',
      px: 3,
      background: `radial-gradient(circle at center, rgba(255,255,255,0.95), rgba(255,255,255,0.75))`,
      border: '2px solid rgba(32, 21, 72, 0.2)',
      borderRadius: '30px',
      backdropFilter: 'blur(20px)',
      boxShadow: `
        inset 0 0 25px rgba(255,255,255,0.3),
        0 8px 40px rgba(32, 21, 72, 0.25),
        0 0 0 2px rgba(255,255,255,0.1)
      `,
      animation: 'floatUpDown 8s ease-in-out infinite',
      transition: 'all 0.6s ease-in-out',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '140%',
        height: '140%',
        background: 'radial-gradient(circle, rgba(32, 21, 72, 0.05), transparent 70%)',
        top: '-20%',
        left: '-20%',
        zIndex: 1,
      },
    }}
  >
    {/* Header */}
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <Typography
        variant="h2"
        sx={{
          zIndex: 2,
          fontWeight: 700,
          fontSize: {
            xs: '1.3rem', // Smaller size for 320px devices
      
            sm: '3rem',
            md: '3.8rem',
            lg: '4.2rem',
            xl: '4.8rem',
          },
          fontFamily: "'Playfair Display', serif",
          color: '#0e0f0f',
          letterSpacing: '1.4px',
          textShadow: `
            0px 0px 1px #ffffff,
            2px 2px 10px rgba(32, 21, 72, 0.2)
          `,
          mb: 2,
          transition: 'all 0.6s ease',
          '&:hover': {
            color: '#201548',
            textShadow: `
              0px 0px 2px #201548,
              3px 3px 12px rgba(32, 21, 72, 0.4)
            `,
            transform: 'scale(1.02)',
          },
        }}
      >
        Bliss Beauty Spa
      </Typography>
    </motion.div>

    {/* Subtitle */}
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          zIndex: 2,
          color: '#201548',
          fontSize: {
            xs: '1.1rem',
            sm: '1.3rem',
            md: '1.5rem',
            lg: '1.6rem',
          },
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 500,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          position: 'relative',
          px: 2,
          textShadow: '0px 2px 6px rgba(0,0,0,0.05)',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: '-8px',
            transform: 'translateX(-50%)',
            width: '50%',
            height: '2px',
            backgroundColor: '#201548',
            borderRadius: '2px',
            opacity: 0.4,
          },
        }}
      >
        Where self-care meets elegance
      </Typography>
    </motion.div>

    {/* Scroll Down Indicator */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 1 }}
      sx={{
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          width: '24px',
          height: '40px',
          border: '2px solid #201548',
          borderRadius: '12px',
          position: 'relative',
          animation: 'bounce 2s infinite ease-in-out',
          mt: 4,
        }}
      >
        <Box
          sx={{
            width: '6px',
            height: '6px',
            backgroundColor: '#201548',
            borderRadius: '50%',
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'scrollDot 2s infinite',
          }}
        />
      </Box>
    </motion.div>
  </Box>
</motion.div>


        {/* Split Image Animation */}
        <motion.div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            cursor: isTablet ? 'pointer' : 'default',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9f8ff 100%)',
                zIndex: 0,
              }}
            />

            <motion.div
              animate={leftControls}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                backgroundImage: `url(${bannerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'left center',
                backgroundRepeat: 'no-repeat',
                zIndex: 5,
              }}
            />

            <motion.div
              animate={rightControls}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                backgroundImage: `url(${bannerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'right center',
                backgroundRepeat: 'no-repeat',
                zIndex: 5,
              }}
            />
          </Box>
        </motion.div>
      </Box>

      {/* Before and After Comparison Section */}
      <Box sx={{ py: 6, px: { xs: 2, sm: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
         <Typography
                 variant="h2"
                 sx={{
                   fontWeight: 800,
                   fontFamily: "'Playfair Display', serif",
                   color: '#201548',
                   textAlign: 'center',
                   mb: 2,
                   fontSize: { xs: '2.5rem', md: '3.75rem' },
                   letterSpacing: { xs: '0.03em', md: '0.05em' },
                   textShadow: '2px 2px 4px rgba(14, 15, 15, 0.05)',
                   position: 'relative',
                   display: 'inline-block',
                   left: '50%',
                   transform: 'translateX(-50%)',
                   '&:after': {
                     content: '""',
                     position: 'absolute',
                     bottom: -12,
                     left: '15%',
                     width: '70%',
                     height: '4px',
                     background: `linear-gradient(90deg, transparent, #201548, transparent)`,
                     borderRadius: '2px',
                     opacity: 0.7,
                   },
                 }}
               >
               Before & After Transformation
               </Typography>

          <Box
            sx={{
              position: 'relative',
              width: '90%',
              maxWidth: '900px',
              margin: '0 auto 60px',
              p: { xs: 2, sm: 3 },
              borderRadius: '24px',
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 40px -15px rgba(32, 21, 72, 0.15)',
              transition: 'all 0.4s ease',
              border: '1px solid rgba(32,21,72,0.08)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 25px 50px -15px rgba(32, 21, 72, 0.2)',
              },
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '24px',
                border: '1px solid rgba(32,21,72,0.05)',
                pointerEvents: 'none',
                zIndex: 1
              }
            }}
          >
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              borderRadius: '16px',
              aspectRatio: '16/9',
              overflow: 'hidden',
              boxShadow: '0 15px 30px -10px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <img
                src={AfterMakeup}
                alt="After Makeup"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />

              <img
                src={BeforeMakeup}
                alt="Before Makeup"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  transition: 'clip-path 0.2s ease-out',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${sliderPosition}%`,
                  width: '4px',
                  backgroundColor: '#ffffff',
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                  transition: 'left 0.2s ease-out',
                  pointerEvents: 'none',
                  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                  borderRadius: '2px'
                }}
              />

              {/* Slider Handle */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${sliderPosition}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  zIndex: 3,
                  transition: 'left 0.2s ease-out',
                  pointerEvents: 'none',
                  boxShadow: '0 2px 15px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #201548'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10L4 14L8 18" stroke="#201548" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 10L20 14L16 18" stroke="#201548" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Labels */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  backgroundColor: 'rgba(14, 15, 15, 0.7)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  zIndex: 4,
                  backdropFilter: 'blur(4px)',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              >
                Before
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(14, 15, 15, 0.7)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  zIndex: 4,
                  backdropFilter: 'blur(4px)',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              >
                After
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={handleSliderChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  zIndex: 5,
                  cursor: 'ew-resize',
                }}
              />
            </Box>
          </Box>
        </motion.div>
        
        {/* Book Now Floating Button */}
        <BookNowButton />
      </Box>
    </Box>
  );
};
<style>
  {`
  
  @keyframes floatUpDown {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

@keyframes scrollDot {
  0% { top: 8px; opacity: 1; }
  50% { top: 20px; opacity: 0.3; }
  100% { top: 8px; opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

  `}
</style>
export default BannerSplitHover;
