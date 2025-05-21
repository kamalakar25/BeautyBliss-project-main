import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";

const BookNow = ({ parlor, onBack }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    shop: parlor ? parlor.name : "",
    date: null,
    time: "",
    favoriteEmployee: "None",
    extraServices: {
      none: false,
      coloring: false,
      facial: false,
      herbal: false,
      massage: false,
      manicure: false,
    },
  });

  const [errors, setErrors] = useState({
    date: false,
    time: false,
    name: false,
    number: false,
    shop: !parlor ? false : null,
    extraServices: false,
  });

  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const nameRef = useRef(null);
  const numberRef = useRef(null);
  const shopRef = useRef(null);
  const extraServicesRef = useRef(null);

  const timeSlots = [
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ];

  const employeeOptions = [
    { name: "John", experience: "5 years" },
    { name: "Emma", experience: "3 years" },
    { name: "Sophia", experience: "7 years" },
    { name: "Liam", experience: "4 years" },
  ];

  const extraServiceOptions = [
    { name: "none", label: "None" },
    { name: "coloring", label: "Coloring" },
    { name: "facial", label: "Facial" },
    { name: "herbal", label: "Herbal" },
    { name: "massage", label: "Massage" },
    { name: "manicure", label: "Manicure" },
  ];

  const currentDate = new Date();
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + 3);

  // Function to filter out past time slots
  const getAvailableTimeSlots = () => {
    const now = new Date();
    const selectedDate = formData.date || now;

    if (selectedDate.toDateString() === now.toDateString()) {
      const currentHour = now.getHours();
      return timeSlots.filter((slot) => {
        const [startTime] = slot.split(" - ");
        const slotHour = parseInt(startTime.split(":")[0]);
        return slotHour > currentHour;
      });
    }
    return timeSlots;
  };

  const handleChange = (e, newValue) => {
    if (e && e.target) {
      const { name, value, type, checked } = e.target;

      if (type === "checkbox") {
        setFormData((prev) => {
          if (name === "none" && checked) {
            return {
              ...prev,
              extraServices: {
                none: true,
                coloring: false,
                facial: false,
                herbal: false,
                massage: false,
                manicure: false,
              },
            };
          } else if (name !== "none" && checked) {
            return {
              ...prev,
              extraServices: {
                ...prev.extraServices,
                [name]: checked,
                none: false,
              },
            };
          } else {
            const updatedExtraServices = {
              ...prev.extraServices,
              [name]: checked,
            };
            return {
              ...prev,
              extraServices: updatedExtraServices,
            };
          }
        });

        setErrors((prev) => {
          const updatedExtraServices =
            type === "checkbox"
              ? {
                  ...formData.extraServices,
                  [name]: checked,
                }
              : formData.extraServices;
          const anySelected = Object.values(updatedExtraServices).some(
            (val) => val
          );
          return {
            ...prev,
            extraServices: !anySelected,
          };
        });
      } else if (name === "name") {
        if (/^[a-zA-Z\s]*$/.test(value)) {
          setFormData((prev) => ({ ...prev, [name]: value }));
          setErrors((prev) => ({ ...prev, name: !value }));
        }
      } else if (name === "number") {
        if (/^[6-9]\d{0,9}$/.test(value) || value === "") {
          setFormData((prev) => ({ ...prev, [name]: value }));
          setErrors((prev) => ({
            ...prev,
            number: !value || value.length !== 10,
          }));
        }
      } else if (name === "favoriteEmployee") {
        setFormData((prev) => ({ ...prev, [name]: value || "None" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: !value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, date: newValue }));
      setErrors((prev) => ({ ...prev, date: !newValue }));
    }
  };

  const handleBookSlot = () => {
    const anyExtraServiceSelected = Object.values(formData.extraServices).some(
      (val) => val
    );
    const newErrors = {
      date: !formData.date,
      time: !formData.time,
      name: !formData.name,
      number: !formData.number || formData.number.length !== 10,
      shop: !parlor ? !formData.shop : null,
      extraServices: !anyExtraServiceSelected,
    };
    setErrors(newErrors);

    if (newErrors.date) {
      dateRef.current.focus();
      return;
    }
    if (newErrors.time) {
      timeRef.current.focus();
      return;
    }
    if (newErrors.name) {
      nameRef.current.focus();
      return;
    }
    if (newErrors.number) {
      numberRef.current.focus();
      return;
    }
    if (newErrors.shop) {
      shopRef.current.focus();
      return;
    }
    if (newErrors.extraServices) {
      extraServicesRef.current.focus();
      return;
    }

    // console.log('Slot booked!', formData);
    onBack();
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: { xs: 2, sm: 3, md: 4 },
    },
    formContainer: {
      width: { xs: "100%", sm: "90%", md: "550px" },
      maxWidth: "550px",
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      p: { xs: 2.5, sm: 3.5, md: 4 },
      display: "flex",
      flexDirection: "column",
      border: "none",
      position: "relative",
      overflow: "hidden",
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "8px",
        background:
          "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
      },
    },
    title: {
      fontSize: { xs: "22px", sm: "26px", md: "30px" },
      fontWeight: "700",
      mb: { xs: 2, sm: 3, md: 4 },
      textAlign: "center",
      color: "#2c3e50",
      letterSpacing: "0.5px",
      position: "relative",
      "&:after": {
        content: '""',
        display: "block",
        width: "60px",
        height: "4px",
        background:
          "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
        margin: "8px auto 0",
        borderRadius: "2px",
      },
    },
    input: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        bgcolor: "#f8f9fa",
        "&:hover fieldset": { borderColor: "#a1c4fd" },
        "&.Mui-focused fieldset": {
          borderColor: "#a1c4fd",
          boxShadow: "0 0 0 2px rgba(161, 196, 253, 0.3)",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#7f8c8d",
        fontSize: { xs: "14px", sm: "16px" },
        transform: "translate(14px, 14px) scale(1)",
        "&.Mui-focused": {
          color: "#a1c4fd",
          transform: "translate(14px, -9px) scale(0.75)",
        },
        "&.MuiFormLabel-filled": {
          transform: "translate(14px, -9px) scale(0.75)",
        },
      },
      "& .MuiOutlinedInput-input": {
        padding: { xs: "12px 14px", sm: "14px" },
        fontSize: { xs: "14px", sm: "16px" },
      },
    },
    select: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        bgcolor: "#f8f9fa",
        "&:hover fieldset": { borderColor: "#a1c4fd" },
        "&.Mui-focused fieldset": {
          borderColor: "#a1c4fd",
          boxShadow: "0 0 0 2px rgba(161, 196, 253, 0.3)",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#7f8c8d",
        fontSize: { xs: "14px", sm: "16px" },
        transform: "translate(14px, 14px) scale(1)",
        "&.Mui-focused": {
          color: "#a1c4fd",
          transform: "translate(14px, -9px) scale(0.75)",
        },
        "&.MuiFormLabel-filled": {
          transform: "translate(14px, -9px) scale(0.75)",
        },
      },
      "& .MuiSelect-select": {
        padding: { xs: "12px 14px", sm: "14px" },
        fontSize: { xs: "14px", sm: "16px" },
      },
      "& .MuiMenuItem-root": {
        fontSize: { xs: "14px", sm: "16px" },
      },
    },
    datePicker: {
      width: "100%",
      "& .MuiTextField-root": {
        width: "100%",
      },
      "& .MuiInputLabel-root": {
        fontSize: { xs: "14px", sm: "16px" },
      },
      "& .MuiOutlinedInput-input": {
        fontSize: { xs: "14px", sm: "16px" },
        padding: { xs: "12px 14px", sm: "14px" },
      },
    },
    extraServices: {
      mb: 3,
      border: (theme) =>
        errors.extraServices ? "2px solid #ff6b6b" : "1px solid #e0e0e0",
      borderRadius: "12px",
      p: { xs: 2, sm: 2.5 },
      bgcolor: "#f8f9fa",
      width: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
      },
    },
    extraServicesTitle: {
      fontSize: { xs: "15px", sm: "17px" },
      fontWeight: "600",
      color: "#2c3e50",
      mb: { xs: 1.5, sm: 2 },
      display: "flex",
      alignItems: "center",
      "&:before": {
        content: '"*"',
        color: "#ff6b6b",
        marginRight: "6px",
      },
    },
    backButton: {
      color: "#6c5ce7",
      borderColor: "#6c5ce7",
      "&:hover": {
        borderColor: "#5649be",
        color: "#5649be",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(108, 92, 231, 0.2)",
      },
      py: { xs: "4px", sm: "8px" },
      px: { xs: "10px", sm: "16px" },
      fontSize: { xs: "10px", sm: "12px", md: "14px" },
      fontWeight: "600",
      borderRadius: "10px",
      transition: "all 0.3s ease",
      whiteSpace: "nowrap",
      minWidth: "0",
    },
    bookButton: {
      background: "linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)",
      "&:hover": {
        background: "linear-gradient(90deg, #8e7ac7 0%, #f9b0e2 100%)",
        transform: "translateY(-2px)",
        boxShadow: "0 6px 15px rgba(161, 140, 209, 0.4)",
      },
      py: { xs: "4px", sm: "8px" },
      px: { xs: "10px", sm: "16px" },
      fontSize: { xs: "10px", sm: "12px", md: "14px" },
      fontWeight: "600",
      borderRadius: "10px",
      transition: "all 0.3s ease",
      color: "white",
      whiteSpace: "nowrap",
      minWidth: "0",
    },
    buttonGroup: {
      display: "flex",
      flexDirection: {
        xs: "row",
        xxs: "column",
      },
      justifyContent: "space-between",
      alignItems: "center",
      mt: { xs: 2, sm: 3 },
      gap: { xs: 1, sm: 2 },
      width: "100%",
      "& .MuiButton-root": {
        flex: { xs: "1 1 48%", sm: "1 1 auto" },
        maxWidth: { xs: "48%", sm: "none" },
      },
    },
    checkbox: {
      color: "#bdc3c7",
      "&.Mui-checked": { color: "#a18cd1" },
      padding: { xs: "6px", sm: "8px" },
    },
    checkboxLabel: {
      m: 0,
      "& .MuiTypography-root": {
        fontSize: { xs: "13px", sm: "14px", md: "15px" },
        color: "#34495e",
      },
    },
    extraServicesContainer: {
      display: "grid",
      gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
      gap: { xs: 1, sm: 1.5 },
    },
    extraServiceItem: {
      display: "flex",
      alignItems: "center",
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={styles.container}>
        <Box sx={styles.formContainer}>
          <Typography sx={styles.title}>Book Your Appointment</Typography>

          <Box sx={{ mb: { xs: 2, sm: 3 }, ...styles.datePicker }}>
            <DatePicker
              inputRef={dateRef}
              label="Date"
              value={formData.date}
              onChange={(newValue) => handleChange(null, newValue)}
              minDate={currentDate}
              maxDate={maxDate}
              format="MMMM d, yyyy"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  error={errors.date}
                  sx={styles.input}
                />
              )}
              views={["day"]}
              openTo="day"
            />
          </Box>

          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <FormControl fullWidth error={errors.time} sx={styles.select}>
              <InputLabel>Time</InputLabel>
              <Select
                inputRef={timeRef}
                name="time"
                value={formData.time}
                onChange={handleChange}
                label="Time"
                required
              >
                <MenuItem value="">
                  <em>Select a time slot</em>
                </MenuItem>
                {getAvailableTimeSlots().map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <TextField
              inputRef={nameRef}
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              error={errors.name}
              inputProps={{ maxLength: 50 }}
              sx={styles.input}
            />
          </Box>

          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <TextField
              inputRef={numberRef}
              fullWidth
              label="Phone Number"
              type="tel"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Enter 10-digit number (6-9)"
              required
              error={errors.number}
              inputProps={{ maxLength: 10 }}
              sx={styles.input}
            />
          </Box>

          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <FormControl fullWidth sx={styles.select}>
              <InputLabel>Favorite Employee (Optional)</InputLabel>
              <Select
                name="favoriteEmployee"
                value={formData.favoriteEmployee}
                onChange={handleChange}
                label="Favorite Employee (Optional)"
                renderValue={(selected) => selected}
              >
                <MenuItem value="None">
                  <em>None</em>
                </MenuItem>
                {employeeOptions.map((emp) => (
                  <MenuItem
                    key={emp.name}
                    value={`${emp.name} - ${emp.experience}`}
                  >
                    {`${emp.name} - ${emp.experience}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={styles.extraServices}>
            <Typography sx={styles.extraServicesTitle}>
              Extra Services
            </Typography>
            <Box sx={styles.extraServicesContainer}>
              {extraServiceOptions.map((option, index) => (
                <Box key={option.name} sx={styles.extraServiceItem}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        inputRef={index === 0 ? extraServicesRef : null}
                        name={option.name}
                        checked={formData.extraServices[option.name]}
                        onChange={handleChange}
                        sx={styles.checkbox}
                      />
                    }
                    label={option.label}
                    sx={styles.checkboxLabel}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {!parlor && (
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              {/* <TextField
                inputRef={shopRef}
                fullWidth
                label="Beauty Shop"
                name="shop"
                value={formData.shop}
                onChange={handleChange}
                placeholder="Enter beauty shop"
                required
                error={errors.shop}
                sx={styles.input}
              /> */}
            </Box>
          )}

          <Box sx={styles.buttonGroup}>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={styles.backButton}
            >
              Back to Parlors
            </Button>

            <Button
              variant="contained"
              onClick={handleBookSlot}
              sx={styles.bookButton}
            >
              Book Slot
            </Button>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default BookNow;
