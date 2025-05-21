import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

const CustomerFeedback = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const feedbackData = [
    {
      name: 'Lisa Redfern',
      image: '//c2.staticflickr.com/8/7310/buddyicons/24846422@N06_r.jpg',
      text: 'I had such an amazing experience at this salon! From the moment I walked in, the staff made me feel welcome and comfortable. My stylist took the time to understand exactly what I wanted, and the results were perfect. The ambiance was relaxing, and everything felt so professional.',
      rating: 5,
    },
    {
      name: 'Cassi',
      image: 'https://i.postimg.cc/ydBjdm20/michael-dam-m-EZ3-Po-FGs-k-unsplash-1.jpg',
      text: 'Absolutely fantastic service! I came in for a haircut and facial, and both exceeded my expectations. The stylist was attentive and offered helpful suggestions based on my hair type. The facial left my skin glowing for days. The entire place was clean, peaceful, and beautifully decorated. I’ll definitely be back!',
      rating: 4,
    },
    {
      name: 'Md Nahidul',
      image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/451270/profile/profile-80.jpg',
      text: 'The salon gave me one of the best pampering experiences I’ve ever had. The staff was not only skilled but also genuinely kind and patient. They listened carefully, gave great advice, and ensured I was happy with every step. The atmosphere was luxurious yet cozy, and the results were stunning.',
      rating: 5,
    },
    {
      name: 'Sarah Thompson',
      image: 'https://easy-peasy.ai/cdn-cgi/image/quality=70,format=auto,width=300/https://media.easy-peasy.ai/552d4700-55bb-4492-bb97-75f43d2df333/fd740456-d67d-4dfd-b94b-c27fea73af5b.png',
      text: 'I went in for a makeover before a big event and left feeling absolutely beautiful. The team was professional, friendly, and really knew their craft. They transformed my look without going overboard. It was the perfect balance of elegance and natural beauty. I’ve received so many compliments since!',
      rating: 4,
    },
    {
      name: 'James Patel',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80',
      text: 'This salon is now my go-to for everything beauty-related. From haircuts to manicures, they do it all with incredible care and attention to detail. I never feel rushed, and the staff always checks in to make sure I’m comfortable.',
      rating: 5,
    },
    {
      name: 'Emily Chen',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80',
      text: 'What a wonderful experience! I visited for a full day of services—haircut, color, pedicure, and massage. Each professional I interacted with was exceptional. They were knowledgeable, polite, and dedicated to providing a relaxing experience. I appreciated the cleanliness and soothing music. I left feeling refreshed, recharged, and totally cared for.',
      rating: 4,
    },
    {
      name: 'Harini',
      image: 'https://t3.ftcdn.net/jpg/04/18/13/92/360_F_418139265_COA2l5jcOW4gF2k0w5NDQVvLnGPwsTcv.jpg',
      text: 'I had such a relaxing experience at this salon. The staff was incredibly polite and attentive from start to finish. My hair wash and styling were done with such care, and I truly appreciated the calm, clean environment. The products used smelled amazing, and the final result was flawless.',
      rating: 5,
    },
    {
      name: 'Swetha',
      image: 'https://easy-peasy.ai/cdn-cgi/image/quality=70,format=auto,width=300/https://media.easy-peasy.ai/2d53018d-134e-4434-83f3-5b512e1fa577/58e9b983-2bdc-497f-991f-e67b84f8ceda.png',
      text: 'From the moment I stepped inside, I felt like I was in a luxury retreat. The decor, music, and lighting set the perfect mood. The stylist was amazing—she understood my style and gave my hair a fresh new life. I’m beyond happy with how everything turned out. Highly recommended!',
      rating: 4,
    },
    {
      name: 'Nandhu',
      image: 'https://t3.ftcdn.net/jpg/01/78/60/12/360_F_178601298_AbZq48t6u9k8bV7RSG8YrKuj7QxAGlhH.jpg',
      text: 'This was my first time visiting the salon, and I was genuinely impressed. I booked a facial and a manicure, and both treatments were done to perfection. The staff explained everything clearly, made me feel at ease, and used high-quality products. I walked out glowing—already looking forward to my next visit!',
      rating: 5,
    },
    {
      name: 'Uma Sharma',
      image: 'https://t3.ftcdn.net/jpg/02/40/78/24/360_F_240782491_rRS0rNEpHkjxCGuTJHvuuY4qVDaIpskX.jpg',
      text: 'Exceptional experience from start to finish! The stylist really took the time to consult with me and made sure the final look matched my vision. They also gave me tips on how to maintain the style at home. Everything was clean, calm, and classy. The service felt truly personalized.',
      rating: 4,
    },
    {
      name: 'Jhones',
      image: 'https://www.shutterstock.com/image-vector/man-shirt-tie-businessman-avatar-600nw-548848999.jpg',
      text: 'I was pleasantly surprised by the professionalism and warmth of the staff. I came in for a hair color treatment and was a little nervous, but they reassured me with clear explanations and expert advice. The result was beautiful and natural-looking. I felt completely taken care of throughout my visit.',
      rating: 5,
    },
    {
      name: 'Sangeetha',
      image: 'https://pics.craiyon.com/2024-09-21/4rzbVu9jStmm7XQI_RES8A.webp',
      text: 'My visit was nothing short of amazing. I booked a package that included a haircut, blow-dry, and pedicure. Every single service was done with attention to detail and a smile. The atmosphere was clean, cozy, and very welcoming. It was the kind of self-care I didn’t know I needed!',
      rating: 4,
    },
  ];

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % feedbackData.length);
      setIsAnimating(false);
    }, 300); // Match Owl Carousel transition speed
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + feedbackData.length) % feedbackData.length);
      setIsAnimating(false);
    }, 300); // Match Owl Carousel transition speed
  };

  const prevIndex = (currentSlide - 1 + feedbackData.length) % feedbackData.length;
  const nextIndex = (currentSlide + 1) % feedbackData.length;

  return (
    <Box
      sx={{
        padding: { xs: '40px 0', md: '60px 0' },
        fontFamily: '"Roboto Slab", serif',
        fontSize: '15px',
        lineHeight: 1.67,
        color: '#444',
        boxSizing: 'border-box',
      }}
    >
      {/* Section Title */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '24px', md: '28px' },
            mb: '20px',
            pb: '20px',
            fontWeight: 400,
            display: 'inline-block',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              height: '2px',
              bgcolor: 'rgba(252, 92, 15, 0.46)',
              left: '25%',
              right: '25%',
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: '15px',
              height: '15px',
              border: '3px solid #fff',
              bgcolor: '#fc5c0f',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: '-6px',
              zIndex: 9,
              borderRadius: '50%',
            },
          }}
        >
          What Clients Say
        </Typography>
      </Box>

      {/* Feedback Slider */}
      <Box
        sx={{
          position: 'relative',
          maxWidth: '1200px',
          mx: 'auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: '20px', md: '40px' },
        }}
      >
        {/* Previous Thumbnail */}
        <Box
          onClick={handlePrev}
          sx={{
            zIndex: 99,
            width: { xs: '60px', md: '98px' },
            height: { xs: '60px', md: '98px' },
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': { opacity: 0.8 },
            display: { xs: 'none', md: 'block' },
          }}
        >
          <img
            src={feedbackData[prevIndex].image}
            alt="Previous"
            className={isAnimating ? '' : 'animated zoomIn'}
            style={{ width: '100%', height: '100%', borderRadius: '50%', opacity: isAnimating ? 0 : 1 }}
          />
          <Box
            sx={{
              // bgcolor: '#eee',
              border: '3px solid #fff',
              color: 'rgba(1, 1, 1, 0.702)',
              fontWeight: 700,
              borderRadius: '50%',
              position: 'absolute',
              width: { xs: '35px', md: '47px' },
              height: { xs: '35px', md: '47px' },
              lineHeight: { xs: '32px', md: '44px' },
              fontSize: '15px',
              top: '-20px',
              left: 0,
              textIndent: '-3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* {feedbackData[prevIndex].rating} */}
            {/* <i
              className="fa fa-star"
              style={{ color: 'rgb(251, 90, 13)', position: 'absolute', top: '10px', right: '5px', fontSize: '12px' }}
            /> */}
          </Box>
        </Box>

        {/* Feedback Card */}
        <Box
          sx={{
            position: 'relative',
            p: { xs: '40px 20px', md: '60px' },
            mt: '-40px',
            maxWidth: '600px',
            width: '100%',
            '&:after': {
              content: '""',
              position: 'absolute',
              left: { xs: '20px', md: '20px' },
              right: { xs: '20px', md: '20px' },
              bottom: 0,
              top: '103px',
              bgcolor: '#f6f6f6',
              border: '1px solid rgba(251, 90, 13, 0.1)',
              borderRadius: '10px',
              zIndex: -1,
            },
          }}
        >
          <img
            src={feedbackData[currentSlide].image}
            alt="Customer Feedback"
            className={`center-block img-circle ${isAnimating ? '' : 'animated zoomIn'}`}
            style={{ width: '85px', height: '85px', opacity: isAnimating ? 0 : 1 }}
          />
          <Typography
            variant="h3"
            className={`customer-name ${isAnimating ? '' : 'animated fadeIn'}`}
            sx={{
              mt: '15px',
              mb: '25px',
              fontSize: { xs: '18px', md: '20px' },
              fontWeight: 500,
              opacity: isAnimating ? 0 : 1,
            }}
          >
            {feedbackData[currentSlide].name}
          </Typography>
          <Typography
            sx={{
              lineHeight: 1.875,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Responsive font size
              color: '#444',
              textAlign: 'justify',
            }}
          >
            {feedbackData[currentSlide].text}
          </Typography>
          <Box
            className={`light-bg customer-rating ${isAnimating ? '' : 'animated zoomIn'}`}
            sx={{
              bgcolor: '#eee',
              border: '3px solid #fff',
              color: 'rgba(1, 1, 1, 0.702)',
              fontWeight: 700,
              borderRadius: '50%',
              position: 'absolute',
              width: '47px',
              height: '47px',
              lineHeight: '44px',
              fontSize: '15px',
              right: '0',
              top: '77px',
              textIndent: '-3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isAnimating ? 0 : 1,
            }}
          >
            {feedbackData[currentSlide].rating}
            <i
              className="fa fa-star"
              style={{ color: 'rgb(251, 90, 13)', position: 'absolute', top: '10px', right: '5px', fontSize: '12px' }}
            />
          </Box>

          {/* Navigation Arrows Inside Card on Last Line */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: '20px',
            }}
          >
            <Box
              onClick={handlePrev}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in',
                '&:hover': { transform: 'translateX(-5px)' },
              }}
            >
              <i
                className="fa fa-long-arrow-left"
                style={{ backgroundColor: 'transparent', color: 'rgb(251, 90, 13)', fontSize: '25px' }}
              />
            </Box>
            <Box
              onClick={handleNext}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in',
                '&:hover': { transform: 'translateX(5px)' },
              }}
            >
              <i
                className="fa fa-long-arrow-right"
                style={{ backgroundColor: 'transparent', color: 'rgb(251, 90, 13)', fontSize: '25px' }}
              />
            </Box>
          </Box>
        </Box>

        {/* Next Thumbnail */}
        <Box
          onClick={handleNext}
          sx={{
            zIndex: 99,
            width: { xs: '60px', md: '98px' },
            height: { xs: '60px', md: '98px' },
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': { opacity: 0.8 },
            display: { xs: 'none', md: 'block' },
          }}
        >
          <img
            src={feedbackData[nextIndex].image}
            alt="Next"
            className={isAnimating ? '' : 'animated zoomIn'}
            style={{ width: '100%', height: '100%', borderRadius: '50%', opacity: isAnimating ? 0 : 1 }}
          />
          <Box
            sx={{
              // bgcolor: '#eee',
              border: '3px solid #fff',
              color: 'rgba(1, 1, 1, 0.702)',
              fontWeight: 700,
              borderRadius: '50%',
              position: 'absolute',
              width: { xs: '35px', md: '47px' },
              height: { xs: '35px', md: '47px' },
              lineHeight: { xs: '32px', md: '44px' },
              fontSize: '15px',
              top: '-20px',
              right: 0,
              textIndent: '-3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* {feedbackData[nextIndex].rating}
            <i
              className="fa fa-star"
              style={{ color: 'rgb(251, 90, 13)', position: 'absolute', top: '10px', right: '5px', fontSize: '12px' }}
            /> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerFeedback;