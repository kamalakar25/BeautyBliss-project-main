import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  keyframes
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import InstagramIcon from '@mui/icons-material/Instagram';

// Image imports
import bgImage from '../Assets/aboutbgimage.jpg';
import HeartImage from '../Assets/aboutimageBG.avif';
import about from '../Assets/About.jpg';
import doctor1 from '../Assets/doctor1.jpg';
import doctor2 from '../Assets/doctor2.jpg';
import doctor3 from '../Assets/doctor3.jpg';
import doctor4 from '../Assets/doctor4.jpg';

const AboutSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:552px)');

  // Define animations
  const fadeIn = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
  `;

  const typewriter = keyframes`
    from { width: 0; }
    to { width: 100%; }
  `;

  const blinkingCursor = keyframes`
    from { border-right-color: rgba(255,255,255,.75); }
    to { border-right-color: transparent; }
  `;

  const specialists = [
    { id: 1, name: 'Dr. Sujana', image: doctor1 },
    { id: 2, name: 'Dr. C. Sridevi', image: doctor2 },
    { id: 3, name: 'Dr. Ravi Babu', image: doctor3 },
    { id: 4, name: 'Dr. Mithun Sharma', image: doctor4 },
  ];

  // const typewriterText = "Hi there, I'm a Typewriter Animation in Material UI!";
  // const typewriterSteps = typewriterText.length; // Dynamically set steps based on text length

  return (
    <>
      {/* About Banner Section */}
      <Box
        sx={{
          backgroundImage: `url(${isMobile ? about : bgImage})`,
          backgroundSize: isMobile ? 'cover' : 'cover', // Changed from '120%' to 'cover' for better fit
          backgroundPosition: isMobile ? 'center' : 'top', // Centered on mobile
          py: { xs: 6, sm: 10 }, // Responsive padding
          mt: 0, // Removed negative margin
          width: '100%', // Full width within container
          textAlign: 'left',
          px: { xs: 2, sm: 4 }, // Responsive horizontal padding instead of fixed pl
          boxSizing: 'border-box', // Include padding in width
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }} // Responsive font size
        >
          About Us
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontSize: { xs: '1rem', sm: '1.25rem' }, // Responsive font size
            maxWidth: '90%', // Prevent text overflow
          }}
        >
          Discover our story, values, and mission to serve you better.
        </Typography>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          py: 3,
          backgroundColor: 'lightSkyBlue',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 6 }} alignItems="center">
          {/* Left Text Section */}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              px: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
            >
              We Care About Your Health
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
            >
              Medhelp Center Hospital, established in 1990, is home to a team of experienced doctors
              who offer a range of specialized services. Located in coastal North Carolina, the
              hospital provides exceptional medical treatment with the support of modern medical
              equipment.
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
            >
              Our doctors are known for their commitment to patient care, and they are always
              available to provide the highest quality of medical services. Whether you require a
              consultation or emergency care, our doctors are ready to assist you around the clock.
            </Typography>

            
          </Box>

          {/* Right Image Section with hover effects */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' },
              width: '100%',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: { xs: '90%', sm: '80%' },
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
                '&:hover img': {
                  filter: 'brightness(1.2)',
                },
                '&:hover .typewriter-overlay': {
                  opacity: 1,
                  animation: `${fadeIn} 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both`,
                },
              }}
            >
              <Box
                component="img"
                src={HeartImage}
                alt="Heart with stethoscope"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition: 'filter 0.3s ease',
                }}
              />
              <Box
                className="typewriter-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '80%',
                    borderRight: '2px solid rgba(0,0,0,.75)',
                    fontSize: { xs: '0.9rem', md: '1.2rem' },
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    animation: `${typewriter} 3s steps(20) 1s 1 normal both, ${blinkingCursor} 500ms steps(20) infinite normal`,
                    fontFamily: '"Anonymous Pro", monospace',
                    color: '#000',
                    p: 1,
                  }}
                >
                  Our Medical Expertise
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Container>

      {/* Meet Our Specialist Section */}
      <Box sx={{ py: 3, backgroundColor: '#f9f9f9' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
            Meet Our Specialist
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4, color: 'gray' }}
          >
            Behind the word mountains, far from the countries Vokalia and Consonantia, there live
            the blind texts. Separated they live in Bookmarks grove right.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
      {specialists.map((doc) => (
        <Grid item key={doc.id} xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              position: 'relative',
              height: 200,
              overflow: 'hidden',
              borderRadius: 2,
              transition: '0.3s',
              '&:hover .hoverOverlay': {
                opacity: 1,
              },
            }}
          >
            <CardMedia
              component="img"
              image={doc.image}
              alt={doc.name}
              sx={{ height: '100%', objectFit: 'cover' }}
            />
            <CardContent
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                bgcolor: 'rgba(255,255,255,0.7)',
                p: 1,
              }}
            >
              <Typography
                variant="body2" // Smaller for non-hovered state
                align="center"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Smaller font
                  color: '#111827',
                }}
              >
                {doc.name}
              </Typography>
            </CardContent>
            <Box
              className="hoverOverlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3,
                opacity: 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
            >
              <Typography
                variant="h5" // Larger for hover state
                align="center"
                sx={{
                  fontWeight: 600,
                  color: '#111827',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                {doc.name}
              </Typography>
              {/* <FacebookIcon sx={{ fontSize: 30, color: '#3b5998', cursor: 'pointer' }} />
              <TwitterIcon sx={{ fontSize: 30, color: '#00acee', cursor: 'pointer' }} />
              <InstagramIcon sx={{ fontSize: 30, color: '#E4405F', cursor: 'pointer' }} /> */}
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AboutSection;