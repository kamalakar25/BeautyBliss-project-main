import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
  keyframes,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

// Define custom marker icon
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const formAnimation = keyframes`
  from { transform: rotateX(-30deg); opacity: 0; }
  to { transform: rotateX(0deg); opacity: 1; }
`;

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

// Styled component for the search input
const StyledTextField = styled(TextField)(({ theme }) => ({
  minWidth: { xs: 200, sm: 300 },
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius,
  '& .MuiInputBase-input': {
    fontSize: { xs: '0.875rem', sm: '1rem' },
    color: '#0e0f0f',
  },
  '& .MuiInputLabel-root': {
    fontSize: { xs: '0.875rem', sm: '1rem' },
    color: '#0e0f0f',
    '&.Mui-focused': { color: '#201548' },
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': { borderColor: '#201548' },
    '&.Mui-focused fieldset': { borderColor: '#201548' },
  },
  '&:hover': {
    '& .MuiInputBase-root': {
      backgroundColor: '#f5f5f5',
    },
  },
}));

export default function SignupForm() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [openMapModal, setOpenMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    phone: '',
    dob: '',
    designation: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    location: '',
    coordinates: { latitude: null, longitude: null },
    displayAddress: '',
    spAddress: '',
    manPower: [],
    services: [],
    fromTime: '',
    toTime: '',
  });

  const [errors, setErrors] = useState({});
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsAdvanced(form.designation !== 'User');
  }, [form.designation]);

  const initializeMap = () => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize Leaflet map
      mapInstanceRef.current = L.map(mapRef.current).setView([40.7128, -74.0060], 10); // Default to New York

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      }).addTo(mapInstanceRef.current);

      // Try to get the user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            mapInstanceRef.current.setView([latitude, longitude], 15);
            setSelectedLocation({ lat: latitude, lng: longitude });
            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
            } else {
              markerRef.current = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapInstanceRef.current);
            }
          },
          () => {
            // Fallback to default location
            mapInstanceRef.current.setView([40.7128, -74.0060], 10);
          },
          { enableHighAccuracy: true }
        );
      }

      // Add click listener to select location on map
      mapInstanceRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstanceRef.current);
        }
      });
    }
  };

  const fetchSearchResults = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      setSearchResults([]);
    }
  };

  const handleGetLocation = () => {
    setOpenMapModal(true);
    setTimeout(initializeMap, 0);
  };

  const handleConfirmLocation = async () => {
    if (!selectedLocation) {
      alert('Please select a location on the map or via search.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: selectedLocation.lat,
          lon: selectedLocation.lng,
          format: 'json',
          addressdetails: 1,
        },
      });
      const address = response.data.display_name || 'Unknown address';
      setForm((prev) => ({
        ...prev,
        location: `Lat: ${selectedLocation.lat.toFixed(6)}, Lon: ${selectedLocation.lng.toFixed(6)}`,
        coordinates: { latitude: selectedLocation.lat, longitude: selectedLocation.lng },
        displayAddress: selectedLocation.address || address,
        spAddress: selectedLocation.address || address,
      }));
      setErrors((prev) => ({ ...prev, location: '', spAddress: '' }));
    } catch (error) {
      alert('Error fetching address. Please try again.');
    } finally {
      setIsLoading(false);
      setOpenMapModal(false);
    }
  };

  const handleCloseModal = () => {
    setOpenMapModal(false);
    setSelectedLocation(null);
    setSearchResults([]);
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    fetchSearchResults(query);
  };

  const handleSearchSelect = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setSelectedLocation({ lat, lng, address: place.display_name });
    mapInstanceRef.current.setView([lat, lng], 15);
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstanceRef.current);
    }
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.value = place.display_name;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
      // Re-validate the other time field if one changes
      ...(name === 'fromTime' && form.toTime
        ? { toTime: validateField('toTime', form.toTime) }
        : name === 'toTime' && form.fromTime
        ? { fromTime: validateField('fromTime', form.fromTime) }
        : {}),
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Please fix the errors in the form.');
      return;
    }

    const payload =
      form.designation.toLowerCase() === 'user'
        ? {
            name: form.name,
            email: form.email,
            gender: form.gender,
            phone: form.phone,
            dob: form.dob,
            designation: form.designation,
            password: form.password,
            bookings: [],
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            gender: form.gender,
            dob: form.dob,
            phone: form.phone,
            designation: form.designation,
            shopName: form.shopName,
            location: form.location,
            spAddress: form.spAddress,
            coordinates: form.coordinates,
            manPower: form.manPower || [],
            services: form.services || [],
            availableTime: { fromTime: form.fromTime, toTime: form.toTime },
          };

    const endpoint =
      form.designation.toLowerCase() === 'user'
        ? `${BASE_URL}/api/users/register`
        : `${BASE_URL}/api/admin/register-admin`;

    try {
      setIsLoading(true);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${form.designation} ${data.message}`);
        navigate('/login');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (name, value) => {
    let error = '';

    if (name === 'name') {
      const isValid = /^[a-zA-Z]+[a-zA-Z\s]*[a-zA-Z]$/.test(value) && value.length >= 2 && value.length <= 50;
      error = value
        ? isValid
          ? ''
          : 'Name must be 2-50 characters, letters only, spaces allowed in middle but not at start or end'
        : 'Name is required';
    }

    if (name === 'email') {
      const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]{2,}\.[a-zA-Z]{2,}$/.test(value);
      error = value ? (isValid ? '' : 'Enter a valid email address') : 'Email is required';
    }

    if (name === 'phone') {
      const cleanedValue = value.replace(/\s/g, '');
      if (cleanedValue === '') {
        error = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(cleanedValue)) {
        error =
          cleanedValue.length !== 10
            ? 'Invalid phone number (must be 10 digits)'
            : 'Phone number must start with 6, 7, 8, or 9';
      }
    }

    if (name === 'dob') {
      const selectedDate = new Date(value);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 18);

      if (!value) {
        error = 'Date of birth is required';
      } else if (selectedDate > today) {
        error = 'Date of birth cannot be in the future';
      } else if (selectedDate > minDate) {
        error = 'You must be at least 18 years old';
      }
    }

    if (name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      error = value
        ? passwordRegex.test(value)
          ? ''
          : 'Password must be at least 8 characters, with an uppercase letter, lowercase letter, number, and special character (@$!%*?&)'
        : 'Password is required';
    }

    if (name === 'confirmPassword') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!value) {
        error = 'Confirm password is required';
      } else if (!passwordRegex.test(value)) {
        error =
          'Password must be at least 8 characters, with an uppercase letter, lowercase letter, number, and special character (@$!%*?&)';
      } else if (value !== form.password) {
        error = 'Passwords do not match';
      }
    }

    if (name === 'shopName' && isAdvanced) {
      const isValid = /^[a-zA-Z]+[a-zA-Z\s]*[a-zA-Z]$/.test(value) && value.length >= 2 && value.length <= 50;
      error = value
        ? isValid
          ? ''
          : 'Shop Name must be 2-50 characters, letters only, spaces allowed in middle but not at start or end'
        : 'Shop Name is required';
    }

    if (name === 'location' && isAdvanced) {
      error = value ? '' : 'Location is required';
    }

    if (name === 'spAddress' && isAdvanced) {
      error = value ? '' : 'Shop address is required';
    }

    if (name === 'fromTime' && isAdvanced) {
      if (!value) {
        error = 'Shop opening time is required';
      } else if (form.toTime) {
        const [fromHours, fromMinutes] = value.split(':').map(Number);
        const [toHours, toMinutes] = form.toTime.split(':').map(Number);
        const fromTimeInMinutes = fromHours * 60 + fromMinutes;
        const toTimeInMinutes = toHours * 60 + toMinutes;
        if (toTimeInMinutes <= fromTimeInMinutes + 60) {
          error = 'Closing time must be at least 1 hour after opening time';
        }
      }
    }

    if (name === 'toTime' && isAdvanced) {
      if (!value) {
        error = 'Shop closing time is required';
      } else if (form.fromTime) {
        const [fromHours, fromMinutes] = form.fromTime.split(':').map(Number);
        const [toHours, toMinutes] = value.split(':').map(Number);
        const fromTimeInMinutes = fromHours * 60 + fromMinutes;
        const toTimeInMinutes = toHours * 60 + toMinutes;
        if (toTimeInMinutes <= fromTimeInMinutes + 60) {
          error = 'Shop must be open for at least 1 hour';
        }
      }
    }

    return error;
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'name' || name === 'shopName') {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
      if (newValue.startsWith(' ')) {
        newValue = newValue.trimStart();
      }
    }

    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
    const error = validateField(name, newValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputSx = {
    mb: 1,
    '& .MuiInputBase-root': {
      borderRadius: '5px',
      backgroundColor: '#ffffff',
      transition: 'all 0.3s ease-in-out',
      transformStyle: 'preserve-3d',
      color: 'black',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 7px 13px -3px rgba(0, 0, 0, 0.3), 0px -3px 0px inset rgba(0, 0, 0, 0.2)',
      '&:hover, &.Mui-focused': {
        borderColor: '#1abc9c',
        transform: 'scale(1.05) rotateY(20deg)',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
      },
    },
    '& .MuiInputBase-input': {
      color: '#0e0f0f',
    },
    '& .MuiInputBase-input.Mui-disabled': {
      color: '#0e0f0f',
      WebkitTextFillColor: '#0e0f0f',
      opacity: 0.7,
    },
    '& .MuiInputBase-input::placeholder': { color: '#0e0f0f', opacity: 0.6 },
    '& .MuiInputLabel-root': { color: '#0e0f0f', '&.Mui-focused': { color: '#201548' } },
    '& .MuiFormHelperText-root': { color: '#F44336' },
  };

  const buttonSx = {
    height: 56,
    borderRadius: '5px',
    border: '2px solid #201548',
    backgroundColor: '#201548',
    color: '#ffffff',
    fontSize: { xs: '14px', sm: '16px' },
    cursor: 'pointer',
    transformStyle: 'preserve-3d',
    transform: 'rotateX(-10deg)',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 7px 13px -3px rgba(0, 0, 0, 0.3), 0px -3px 0px inset rgba(0, 0, 0, 0.2)',
    '&:hover': {
      backgroundColor: '#1a1138',
      fontSize: { xs: '15px', sm: '17px' },
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 7px 13px -3px rgba(0, 0, 0, 0.3), 0px -3px 0px inset rgba(0, 0, 0, 0.2)',
    },
    '&:disabled': {
      backgroundColor: '#cccccc',
      color: '#666666',
      borderColor: '#cccccc',
      transform: 'rotateX(-10deg)',
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
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ zIndex: 2 }}>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: { xs: '20px', sm: '30px' },
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            perspective: '1000px',
            transform: 'rotateX(-10deg)',
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 7px 13px -3px rgba(0, 0, 0, 0.3), 0px -3px 0px inset rgba(0, 0, 0, 0.2)',
            animation: `${formAnimation} 0.5s ease-in-out`,
            width: { xs: '90vw', sm: '400px' },
            maxWidth: '450px',
            marginTop: '20px',
          }}
        >
          <style>
            {`
              h2.text-primary1 {
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                font-size: 2rem;
                color: #0e0f0f;
                position: relative;
                margin-bottom: 1.5rem;
              }

              h2.text-primary1::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 100px;
                height: 4px;
                background: #201548;
                border-radius: 2px;
              }
            `}
          </style>
          <h2
            className="text-primary1 fw-bold mb-4 animate__animated animate__fadeInDown text-center"
            style={{
              animationDuration: '1s',
              fontSize: '2rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#000',
            }}
          >
            Create Your Account
          </h2>

          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            value={form.name}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            error={!!errors.name}
            helperText={errors.name}
            disabled={isLoading}
            autoComplete="off"
            sx={inputSx}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={form.email}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isLoading}
            autoComplete="off"
            sx={inputSx}
          />

          <TextField
            select
            variant="outlined"
            fullWidth
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            disabled={isLoading}
            sx={inputSx}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            name="phone"
            value={form.phone}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            error={!!errors.phone}
            helperText={errors.phone}
            disabled={isLoading}
            inputProps={{ maxLength: 10 }}
            autoComplete="off"
            sx={inputSx}
          />

          <TextField
            label="Date of Birth"
            type="date"
            variant="outlined"
            fullWidth
            name="dob"
            value={form.dob}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            error={!!errors.dob}
            helperText={errors.dob}
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: new Date().toISOString().split('T')[0],
              min: new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0],
            }}
            autoComplete="off"
            sx={inputSx}
          />

          <TextField
            select
            variant="outlined"
            fullWidth
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            disabled={isLoading}
            sx={inputSx}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Salon">Salon</MenuItem>
            <MenuItem value="Beauty_Parler">Beauty Parlor</MenuItem>
            <MenuItem value="Doctor">Doctor</MenuItem>
          </TextField>

          {isAdvanced && (
            <>
              <TextField
                label="Shop Name"
                variant="outlined"
                fullWidth
                name="shopName"
                value={form.shopName}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                error={!!errors.shopName}
                helperText={errors.shopName}
                disabled={isLoading}
                autoComplete="off"
                sx={inputSx}
              />

              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Shop Address"
                  variant="outlined"
                  fullWidth
                  name="spAddress"
                  value={form.spAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.spAddress}
                  helperText={errors.spAddress}
                  disabled={true}
                  autoComplete="off"
                  sx={inputSx}
                />
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="outlined"
                    onClick={handleGetLocation}
                    disabled={isLoading}
                    sx={{
                      ...buttonSx,
                      backgroundColor: '#ffffff',
                      borderColor: '#201548',
                      color: '#201548',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        color: '#201548',
                        borderColor: '#201548',
                        transform: 'scale(1.05) rotateY(20deg) rotateX(10deg)',
                      },
                    }}
                  >
                    Get <i className="fa-solid fa-location-dot" style={{ marginLeft: '8px' }}></i>
                  </Button>
                </motion.div>
              </Box>

              {form.coordinates.latitude && form.coordinates.longitude && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#0e0f0f' }}>
                    Coordinates: {form.location}
                  </Typography>
                  <MuiLink
                    href={`https://www.openstreetmap.org/?mlat=${form.coordinates.latitude}&mlon=${form.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    sx={{ color: '#0e0f0f', '&:hover': { color: '#201548', transform: 'scale(1.05)' } }}
                  >
                    View on OpenStreetMap
                  </MuiLink>
                </Box>
              )}

              <TextField
                label="Shop Opening Time"
                type="time"
                variant="outlined"
                fullWidth
                name="fromTime"
                value={form.fromTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.fromTime}
                helperText={errors.fromTime}
                disabled={isLoading}
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                sx={inputSx}
              />

              <TextField
                label="Shop Closing Time"
                type="time"
                variant="outlined"
                fullWidth
                name="toTime"
                value={form.toTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.toTime}
                helperText={errors.toTime}
                disabled={isLoading}
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                sx={inputSx}
              />
            </>
          )}

          {(form.designation === 'User' || isAdvanced) && (
            <>
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                name="password"
                value={form.password}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                autoComplete="new-password"
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={isLoading}
                        sx={{ color: '#0e0f0f' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleFieldChange}
                onBlur={handleBlur}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                autoComplete="new-password"
                sx={inputSx}
              />
            </>
          )}

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              fullWidth
              sx={{
                padding: { xs: '8px 16px', sm: '10px 20px' },
                borderRadius: '5px',
                backgroundColor: '#201548',
                color: '#ffffff',
                fontSize: { xs: '14px', sm: '16px' },
                transform: 'rotateX(-10deg)',
                transition: 'all 0.3s ease-in-out',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 7px 13px -3px rgba(0, 0, 0, 0.3), 0px -3px 0px inset rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#1a1138',
                  fontSize: { xs: '15px', sm: '17px' },
                  transform: 'scale(1.05) rotateY(20deg) rotateX(10deg)',
                },
                '&:disabled': {
                  backgroundColor: '#cccccc',
                  color: '#666666',
                  transform: 'rotateX(-10deg)',
                },
              }}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </motion.div>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <MuiLink
              component={Link}
              to="/login"
              underline="hover"
              sx={{ fontSize: { xs: 12, sm: 14 }, color: '#0e0f0f', '&:hover': { color: '#201548' } }}
            >
              Already have an account? Log In
            </MuiLink>
          </Box>
        </Box>
      </motion.div>

      <Dialog open={openMapModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#0e0f0f' }}>Select Location</DialogTitle>
        <DialogContent>
          <StyledTextField
            inputRef={searchInputRef}
            label="Your Location"
            variant="outlined"
            fullWidth
            placeholder="Search for any place (e.g., college, shop, park)"
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
          />
          {searchResults.length > 0 && (
            <Box sx={{ maxHeight: '150px', overflowY: 'auto', mb: 2 }}>
              {searchResults.map((place) => (
                <Box
                  key={place.place_id}
                  sx={{
                    p: 1,
                    borderBottom: '1px solid #ccc',
                    cursor: 'pointer',
                    color: '#0e0f0f',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                  onClick={() => handleSearchSelect(place)}
                >
                  <Typography variant="body2">{place.display_name}</Typography>
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ height: '400px', width: '100%', mb: 2 }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirmLocation} disabled={isLoading || !selectedLocation}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}