// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const BASE_URL = process.env.REACT_APP_API_URL;

const UserProfile = () => {
  const userEmail = localStorage.getItem('email');
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userEmail) {
      axios
        .get(`${BASE_URL}/api/users/userProfile/${encodeURIComponent(userEmail)}`)
        .then((res) => {
          setUser(res.data);
          setFormData({ ...res.data, password: '', confirmPassword: '' });
        })
        .catch((err) => {
          console.error('Failed to fetch user:', err);
        });
    }
  }, [userEmail]);

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

    if (name === 'gender') {
      error = value ? '' : 'Gender is required';
    }

    if (name === 'password' && value) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      error = passwordRegex.test(value)
        ? ''
        : 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character';
    }

    if (name === 'confirmPassword' && value) {
      error = value === formData.password ? '' : 'Passwords do not match';
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'name') {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
      if (newValue.startsWith(' ')) {
        newValue = newValue.trimStart();
      }
    }

    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    const error = validateField(name, newValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleEdit = () => {
    setEditMode(true);
    setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};
    ['name', 'email', 'phone', 'dob', 'gender'].forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (formData.password) {
      const passwordError = validateField('password', formData.password);
      const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
      if (passwordError) newErrors.password = passwordError;
      if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Please fix the errors in the form.');
      return;
    }

    // Prepare update data, exclude password and confirmPassword if empty
    const updateData = { ...formData };
    if (!updateData.password) {
      delete updateData.password;
    }
    delete updateData.confirmPassword;

    axios
      .put(`${BASE_URL}/api/users/updateProfile/${encodeURIComponent(userEmail)}`, updateData)
      .then((res) => {
        setUser(res.data.user);
        alert('Profile updated successfully!');
        setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        setErrors({});
        setEditMode(false);
      })
      .catch((err) => {
        console.error('Failed to update profile:', err);
        alert(err.response?.data?.message || 'Update failed');
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Not specified';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Card
        sx={{
          width: '90%',
          maxWidth: 600,
          boxShadow: '0px 10px 30px rgba(0,0,0,0.3)',
          borderRadius: 4,
          transform: 'rotateX(3deg)',
          transition: '0.3s ease',
          '&:hover': {
            transform: 'rotateX(0deg) scale(1.02)',
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            User Profile
          </Typography>

          {[
            { label: 'Name', key: 'name' },
            { label: 'Email', key: 'email' },
            { label: 'Gender', key: 'gender', isSelect: true },
            { label: 'Phone', key: 'phone' },
            { label: 'Date of Birth', key: 'dob', isDateInput: true },
            { label: 'Designation', key: 'designation', disabled: true },
            { label: 'Joined At', key: 'createdAt', disabled: true, isDate: true },
            { label: 'Password', key: 'password', isPassword: true },
            ...(editMode
              ? [{ label: 'Confirm Password', key: 'confirmPassword', isPassword: true, isConfirmPassword: true }]
              : []),
          ].map((item) => (
            <Box
              key={item.key}
              sx={{
                mt: 2,
                display: { xs: 'block', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Typography
                fontWeight="600"
                sx={{ flex: { md: '0 0 150px' }, textAlign: { md: 'left' } }}
              >
                {item.label}:
              </Typography>
              {editMode && !item.disabled ? (
                item.isPassword ? (
                  <Box sx={{ position: 'relative', display: 'inline-block', flex: 1 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      type={item.isConfirmPassword ? (showConfirmPassword ? 'text' : 'password') : (showPassword ? 'text' : 'password')}
                      name={item.key}
                      value={formData[item.key] || ''}
                      onChange={handleChange}
                      placeholder={item.isConfirmPassword ? 'Confirm new password' : 'Enter new password'}
                      fullWidth
                      error={!!errors[item.key]}
                      helperText={errors[item.key]}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                item.isConfirmPassword
                                  ? setShowConfirmPassword(!showConfirmPassword)
                                  : setShowPassword(!showPassword)
                              }
                              sx={{ position: 'absolute', right: 0, top: 0 }}
                            >
                              {(item.isConfirmPassword ? showConfirmPassword : showPassword) ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                ) : item.isSelect ? (
                  <TextField
                    select
                    variant="outlined"
                    size="small"
                    name={item.key}
                    value={formData[item.key] || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ flex: 1 }}
                    error={!!errors[item.key]}
                    helperText={errors[item.key]}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </TextField>
                ) : (
                  <TextField
                    variant="outlined"
                    size="small"
                    type={item.isDateInput ? 'date' : 'text'}
                    name={item.key}
                    value={formData[item.key] || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ flex: 1 }}
                    error={!!errors[item.key]}
                    helperText={errors[item.key]}
                    InputLabelProps={item.isDateInput ? { shrink: true } : {}}
                    inputProps={
                      item.isDateInput
                        ? {
                            max: new Date().toISOString().split('T')[0],
                            min: new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                              .toISOString()
                              .split('T')[0],
                          }
                        : {}
                    }
                  />
                )
              ) : (
                <Typography sx={{ flex: 1, textAlign: { md: 'left' } }}>
                  {item.isPassword
                    ? '********'
                    : item.isDate
                    ? formatDate(user[item.key])
                    : user[item.key] || 'Not specified'}
                </Typography>
              )}
            </Box>
          ))}

          <Box sx={{ mt: 4 }}>
            {editMode ? (
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                sx={{ px: 4, borderRadius: 3 }}
                disabled={Object.values(errors).some((error) => error)}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                sx={{ px: 4, borderRadius: 3 }}
              >
                Edit
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
