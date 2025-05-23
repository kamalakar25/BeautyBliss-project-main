import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_URL;

const Pay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    parlor,
    totalAmount,
    service,
    relatedServices,
    name,
    date,
    time,
    favoriteEmployee,
  } = location.state || {};

  const [paymentAmountOption, setPaymentAmountOption] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    if (
      !totalAmount ||
      !name ||
      !service ||
      !date ||
      !time ||
      !favoriteEmployee ||
      !parlor?.email ||
      !parlor?.name
    ) {
      setError(
        'Missing booking details. Please start the booking process again.'
      );
      setTimeout(() => navigate('/bookslot'), 3000);
    }
  }, [
    totalAmount,
    name,
    service,
    date,
    time,
    favoriteEmployee,
    parlor,
    navigate,
  ]);

  // Fetch terms and conditions
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/terms/terms`);
        // Remove duplicates based on the 'term' property
        const uniqueTerms = Array.from(
          new Set(response.data.map((item) => item.term))
        ).map((term) => response.data.find((item) => item.term === term));
        setTerms(uniqueTerms);
      } catch (error) {
        // console.error('Pay: Failed to fetch terms:', error.message);
        setError('Failed to fetch terms and conditions. Please try again.');
        setTerms([]);
      }
    };
    fetchTerms();
  }, []);

  const handlePaymentAmountChange = (e) => {
    setPaymentAmountOption(e.target.value);
    setError('');
  };

  const calculatePaymentAmount = () => {
    if (!totalAmount) return 0;
    return paymentAmountOption === '25%' ? totalAmount * 0.25 : totalAmount;
  };

  const createNotifications = async (
    bookingId,
    userEmail,
    parlorEmail,
    paymentStatus
  ) => {
    try {
      // const userNotification = {
      //   recipientEmail: userEmail,
      //   recipientType: 'User',
      //   type: 'Booking',
      //   title: 'Booking Confirmation',
      //   message: `Your booking for ${service} on ${date} at ${time} with ${favoriteEmployee} at ${
      //     parlor.name
      //   } has been ${
      //     paymentStatus === 'PAID'
      //       ? 'successfully paid'
      //       : 'pending payment confirmation'
      //   }.`,
      //   bookingId,
      //   userDetails: { name, email: userEmail, phone: '' }, // Hardcoded phone for simplicity
      //   isRead: false,
      // };

      // const spNotification = {
      //   recipientEmail: parlor.email,
      //   recipientType: 'ServiceProvider',
      //   type: 'Booking',
      //   title: 'New Booking',
      //   message: `New booking for ${service} by ${name} on ${date} at ${time} with ${favoriteEmployee}. Please confirm the booking.`,
      //   bookingId,
      //   userDetails: { name, email: userEmail, phone: '' },
      //   isRead: false,
      // };

      await axios.post(
        `${BASE_URL}/api/notifications/create-booking-notification`,
        {
          userEmail,
          parlorEmail,
          bookingId,
        }
      );
      // console.log('Pay: Notifications created successfully');
    } catch (error) {
      // console.error('Pay: Failed to create notifications:', error.message);
      setError(
        'Failed to create booking notifications. Booking is still confirmed.'
      );
    }
  };

  const handleConfirm = async () => {
    if (!paymentAmountOption) {
      setError('Please select a payment amount (25% or Full).');
      return;
    }

    if (!totalAmount || totalAmount <= 0) {
      setError('Invalid total amount. Please try again.');
      return;
    }

    if (!window.Razorpay) {
      setError('Razorpay SDK not loaded. Please refresh the page.');
      return;
    }

    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        setError('User email not found. Please log in again.');
        return;
      }

      const bookingData = {
        parlorEmail: parlor.email,
        parlorName: parlor.name,
        name,
        date,
        time,
        service,
        amount: calculatePaymentAmount(),
        total_amount: totalAmount,
        relatedServices,
        favoriteEmployee,
        userEmail,
      };

      // console.log('Pay: Creating order with bookingData:', bookingData);
      const response = await axios.post(
        `${BASE_URL}/api/razorpay/order`,
        bookingData
      );
      const { order, bookingId } = response.data;

      if (!order || !bookingId) {
        throw new Error('Failed to create order or booking');
      }

      const options = {
        key: 'rzp_test_UlCC6Rw2IJrhyh',
        amount: order.amount,
        currency: order.currency,
        name: 'Parlor Booking',
        description: `Payment for booking ${bookingId}`,
        order_id: order.id,
        handler: async function (response) {
          let pin = Math.floor(Math.random() * 90000) + 10000;
          try {
            // console.log('Pay: Validating payment with response:', response);
            const validationResponse = await axios.post(
              `${BASE_URL}/api/razorpay/order/validate`,
              {
                pin,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userEmail,
                bookingId,
              }
            );
            // console.log(
            //   'Pay: Payment validation response:',
            //   validationResponse.data
            // );

            // Create notifications for user and service provider
            await createNotifications(
              bookingId,
              userEmail,
              parlor.email,
              'PAID'
            );

            navigate(
              `/payment/callback?order_id=${response.razorpay_order_id}`,
              {
                state: {
                  ...location.state,
                  bookingId,
                  paymentStatus: 'PAID',
                  transactionId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  currency: order.currency,
                  amount: bookingData.amount,
                  total_amount: bookingData.total_amount,
                  Payment_Mode:
                    validationResponse.data.paymentMethod || 'UNKNOWN',
                  createdAt: new Date().toISOString(),
                },
              }
            );
          } catch (err) {
            // console.error('Pay: Payment verification failed:', err.message);
            setError(
              `Payment verification failed: ${
                err.response?.data?.error || err.message
              }`
            );
            await createNotifications(
              bookingId,
              userEmail,
              parlor.email,
              'FAILED'
            );
            navigate(
              `/payment/callback?order_id=${response.razorpay_order_id}`,
              {
                state: {
                  ...location.state,
                  bookingId,
                  paymentStatus: 'FAILED',
                  transactionId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  failureReason:
                    err.response?.data?.reason || 'Validation failed',
                  currency: order.currency,
                  amount: bookingData.amount,
                  total_amount: bookingData.total_amount,
                  Payment_Mode: 'UNKNOWN',
                  createdAt: new Date().toISOString(),
                },
              }
            );
          }
        },
        prefill: {
          name,
          email: userEmail,
          contact: '9234567890',
        },
        notes: { bookingId, userEmail },
        theme: { color: '#4a3f8c' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (response) {
        const failureReason = response.error.description || 'Payment failed';
        // console.error('Pay: Payment failed:', response.error);
        setError(`Payment failed: ${failureReason}`);
        try {
          const errorResponse = await axios.post(
            `${BASE_URL}/api/razorpay/order/validate`,
            {
              razorpay_order_id: response.error.metadata.order_id,
              razorpay_payment_id: response.error.metadata.payment_id,
              razorpay_signature: '',
              userEmail,
              bookingId,
              failureReason,
            }
          );
          await createNotifications(
            bookingId,
            userEmail,
            parlor.email,
            'FAILED'
          );
        } catch (err) {
          // console.error('Pay: Failed to validate failed payment:', err.message);
        }
        navigate(
          `/payment/callback?order_id=${response.error.metadata.order_id}`,
          {
            state: {
              ...location.state,
              bookingId,
              paymentStatus: 'FAILED',
              transactionId: response.error.metadata.payment_id,
              orderId: response.error.metadata.order_id,
              failureReason,
              currency: order.currency,
              amount: bookingData.amount,
              total_amount: bookingData.total_amount,
              Payment_Mode: 'UNKNOWN',
              createdAt: new Date().toISOString(),
            },
          }
        );
      });
      rzp.open();

      setShowSuccess(true);
      setError('');
    } catch (err) {
      // console.error('Pay: Error processing request:', err.message);
      const errorMessage = err.response?.data?.error || err.message;
      setError(`Error processing request: ${errorMessage}`);
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 1000,
        mx: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: 4,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': { boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' },
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        marginTop: '120px',
      }}
    >
      <h2
        className='fw-bold mb-4 animate_animated animate_fadeInDown'
        style={{
          animationDuration: '0.8s',
          fontSize: '2rem',
          letterSpacing: '1.2px',
          fontWeight: 600,
          color: '#6683a8',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Payment for Booking
      </h2>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        {/* Booking Summary Section */}
        <Box
          sx={{
            flex: 1,
            minWidth: '48%',
            p: 4,
            borderRadius: 2,
            backgroundColor: '#f9f9f9',
            color: '#333333',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' },
            border: '1px solid #4a3f8c',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              color: '#4a3f8c',
              mb: 2,
              textDecoration: 'underline',
            }}
          >
            Booking Summary
          </Typography>
          <Typography sx={{ mb: 1, color: '#333333' }}>
            <strong>Parlor:</strong> {parlor?.name || 'N/A'}
          </Typography>
          <Typography sx={{ mb: 1, color: '#333333' }}>
            <strong>Service:</strong> {service || 'N/A'}
          </Typography>
          <Typography sx={{ mb: 1, color: '#333333' }}>
            <strong>Date:</strong> {date || 'N/A'}
          </Typography>
          <Typography sx={{ mb: 1, color: '#333333' }}>
            <strong>Time:</strong> {time || 'N/A'}
          </Typography>
          <Typography sx={{ mb: 1, color: '#333333' }}>
            <strong>Employee:</strong> {favoriteEmployee || 'N/A'}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#4a3f8c' }}>
            Total Amount: ₹{totalAmount || '0'}
          </Typography>
        </Box>

        {/* Select Payment Amount Section */}
        <Box
          sx={{
            flex: 1,
            minWidth: '48%',
            p: 4,
            borderRadius: 2,
            backgroundColor: '#f9f9f9',
            color: '#333333',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' },
            border: '1px solid #4a3f8c',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              color: '#4a3f8c',
              mb: 2,
              textDecoration: 'underline',
            }}
          >
            Select Payment Amount
          </Typography>
          <RadioGroup
            value={paymentAmountOption}
            onChange={handlePaymentAmountChange}
          >
            <FormControlLabel
              style={{ color: '#333333' }}
              value='25%'
              control={<Radio />}
              label={`Cash on payment [Min 25% (₹${(totalAmount * 0.25).toFixed(
                2
              )}) we need to pay`}
            />
            <FormControlLabel
              style={{ color: '#333333' }}
              value='full'
              control={<Radio />}
              label={`Full Amount (₹${totalAmount})`}
            />
          </RadioGroup>

          {paymentAmountOption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                sx={{
                  mt: 2,
                  color: '#4a3f8c',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': { color: '#6683a8' },
                }}
                onClick={handleOpenModal}
              >
                You have accepted terms & conditions
              </Typography>
            </motion.div>
          )}

          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {showSuccess && (
            <Alert severity='success' sx={{ mt: 2 }}>
              Payment option selected successfully!
            </Alert>
          )}

          <motion.button
            onClick={handleConfirm}
            style={{
              background: 'rgba(74, 63, 140, 0.1)',
              color: '#4a3f8c',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(74, 63, 140, 0.3)',
              fontSize: '1rem',
              fontWeight: 500,
              width: 'fit-content',
              marginTop: '20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
            }}
            whileHover={{
              background: 'rgba(74, 63, 140, 0.2)',
              borderColor: '#4a3f8c',
            }}
            transition={{ duration: 0.3 }}
          >
            Confirm Payment
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#4a3f8c'
              style={{ marginLeft: '8px' }}
            >
              <path d='M5 12h14M12 5l7 7-7 7' strokeWidth='2' />
            </svg>
          </motion.button>
        </Box>
      </Box>

      {/* Terms and Conditions Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby='terms-modal-title'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 4,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              p: 4,
              maxWidth: 500,
              width: '90%',
              position: 'relative',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#4a3f8c',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              id='terms-modal-title'
              variant='h6'
              sx={{
                color: '#4a3f8c',
                mb: 3,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              Terms & Conditions
            </Typography>
            <Box sx={{ color: '#333333', fontSize: '0.9rem' }}>
              <Typography sx={{ mb: 2 }}>
                By proceeding with the payment, you have agreed to the following
                terms:
              </Typography>
              {terms.length > 0 ? (
                <ol>
                  {terms.map((term, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                      {term.term}
                    </li>
                  ))}
                </ol>
              ) : (
                <Typography sx={{ mb: 2 }}>
                  No terms and conditions available.
                </Typography>
              )}
            </Box>
            <Button
              onClick={handleCloseModal}
              sx={{
                mt: 3,
                bgcolor: '#4a3f8c',
                color: '#ffffff',
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 500,
                '&:hover': { bgcolor: '#6683a8' },
                display: 'block',
                mx: 'auto',
              }}
            >
              Close
            </Button>
          </Box>
        </motion.div>
      </Modal>

      <style>
        {`
        h2.text-primary {
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            font-size: 2rem;
            color: #0e0f0f;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            position: relative;
            margin-bottom: 1.5rem;
          }

          h2.text-primary::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 2px;
            background: #0e0f0f;
            border-radius: 1px;
          }`}
      </style>
    </Box>
  );
};

export default Pay;
