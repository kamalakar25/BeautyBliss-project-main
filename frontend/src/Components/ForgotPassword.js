import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    designation: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.email || '',
        designation: location.state.designation || '',
      }));
    }
  }, [location.state]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOTP = async () => {
    if (!formData.email || !formData.designation) {
      alert('Email and role are required to send OTP');
      return;
    }

    const otp = generateOTP();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/users/ForgotPassword/SendOTP`, {
        email: formData.email,
        OTP: otp,
        designation: formData.designation,
      });

      alert(response.data.message); // Notify user that OTP was sent
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setErrors((prev) => ({ ...prev, otp: 'OTP is required' }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/users/get/otp`, {
        email: formData.email,
        designation: formData.designation,
      });

      const { otp } = response.data;
      if (otp == formData.otp) {
        alert('OTP verified successfully');
        setIsOtpVerified(true);
        setErrors((prev) => ({ ...prev, otp: '' }));
        setFormData((prev) => ({ ...prev, otp: '' })); // Clear OTP field
      } else {
        setErrors((prev) => ({ ...prev, otp: 'Invalid OTP' }));
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert(error.response?.data?.message || 'Failed to verify OTP');
      setErrors((prev) => ({ ...prev, otp: error.response?.data?.message || 'Server error' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'otp') {
      setErrors((prev) => ({ ...prev, otp: value ? '' : 'OTP is required' }));
    }

    if (name === 'password') {
      let error = '';
      if (!value) {
        error = 'Password is required';
      } else if (!passwordRegex.test(value)) {
        error =
          'Password must contain at least 8 characters, one uppercase letter, one number, and one special character';
      }
      setErrors((prev) => ({ ...prev, password: error }));
    }

    if (name === 'confirmPassword') {
      let error = '';
      if (!value) {
        error = 'Confirm password is required';
      } else if (value !== formData.password) {
        error = 'Passwords do not match';
      }
      setErrors((prev) => ({ ...prev, confirmPassword: error }));
    }
  };

  const handleResetPassword = async () => {
    if (errors.password || errors.confirmPassword || !formData.password || !formData.confirmPassword) {
      alert('Please correct the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/api/users/update/password`, {
        email: formData.email,
        designation: formData.designation,
        password: formData.password,
      });

      alert(response.data.message); // Show success message
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error updating password:', error);
      alert(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const inputSx = {
    mb: 2,
    '& .MuiInputBase-root': {
      borderRadius: '5px',
      backgroundColor: 'transparent',
      color: 'black',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
      '&:hover, &.Mui-focused': {
        borderColor: '#1abc9c',
        transform: 'scale(1.05)',
      },
    },
    '& .MuiInputBase-input': { color: 'black' },
    '& .MuiInputLabel-root': { color: 'black', '&.Mui-focused': { color: 'black' } },
    '& .MuiFormHelperText-root': { color: 'black' },
  };

  const buttonSx = {
    height: 56,
    borderRadius: '5px',
    backgroundColor: '#201548',
    color: '#fff',
    fontSize: { xs: '14px', sm: '16px' },
    '&:hover': {
      backgroundColor: '#201548',
    },
    '&:disabled': {
      backgroundColor: '#7f8c8d',
      color: '#bdc3c7',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(https://images.pexels.com/photos/7750102/pexels-photo-7750102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: '20px', sm: '30px' },
          // backgroundImage: 'linear-gradient(135deg,rgba(32, 21, 72, 0.07) 0%, #201548 100%)',
          borderRadius: '10px',
          width: { xs: '90vw', sm: '400px' },
          maxWidth: '450px',
          zIndex: 2,
          textAlign: 'center',
          border: '1px solid #201548',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: '#0e0f0f' }}>
          Forgot Password
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, color: '#0e0f0f' }}>
          <strong>Email:</strong> {formData.email || 'Not provided'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: '#0e0f0f' }}>
          <strong>Role:</strong> {formData.designation || 'Not provided'}
        </Typography>

        {!isOtpSent ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              onClick={handleSendOTP}
              disabled={isLoading || !formData.email || !formData.designation}
              fullWidth
              sx={buttonSx}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </motion.div>
        ) : !isOtpVerified ? (
          <>
            <TextField
              label="Enter OTP"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              fullWidth
              error={!!errors.otp}
              helperText={errors.otp}
              disabled={isLoading}
              sx={inputSx}
              inputProps={{ maxLength: 6, pattern: '[0-9]*', type: 'text' }}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={handleVerifyOTP}
                disabled={isLoading || !formData.otp}
                fullWidth
                sx={buttonSx}
              >
                {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
              sx={inputSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={isLoading}
                      sx={{ color: 'black' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={isLoading}
              sx={inputSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      disabled={isLoading}
                      sx={{ color: 'black' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={handleResetPassword}
                disabled={isLoading || errors.password || errors.confirmPassword || !formData.password}
                fullWidth
                sx={buttonSx}
              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </motion.div>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;