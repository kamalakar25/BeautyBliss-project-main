import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Modal,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { motion } from "framer-motion";

const BASE_URL = process.env.REACT_APP_API_URL;
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/70?text=No+Image";

// Styled components
const StyledListItem = styled(ListItem)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: "12px",
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  height: "auto",
  maxHeight: "120px",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  borderLeft: `4px solid ${getRandomLightColor()}`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.2),
    maxHeight: "100px",
  },
  [`@media (max-width: 360px)`]: {
    padding: theme.spacing(1),
    maxHeight: "90px",
  },
  [`@media (max-width: 320px)`]: {
    padding: theme.spacing(0.8),
    maxHeight: "185px",
  },
  [`@media (max-width: 599.995px)`]: {
    padding: theme.spacing(0.8),
    maxHeight: "185px",
  },
  [`@media (max-width: 1450px)`]: {
    padding: theme.spacing(0.8),
    maxHeight: "185px",
  },
}));

const getRandomLightColor = () => {
  const colors = [
    "#FFCCCB",
    "#CCFFCC",
    "#CCDDFF",
    "#FFEECC",
    "#DDCCFF",
    "#CCFFFF",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: "10px",
  objectFit: "cover",
  [theme.breakpoints.down("sm")]: {
    width: 55,
    height: 55,
  },
  [`@media (max-width: 360px)`]: {
    width: 50,
    height: 50,
  },
  [`@media (max-width: 320px)`]: {
    width: 45,
    height: 45,
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: "#201548",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  padding: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.8),
  },
  [`@media (max-width: 360px)`]: {
    padding: theme.spacing(0.6),
  },
  [`@media (max-width: 320px)`]: {
    padding: theme.spacing(0.5),
  },
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  backgroundColor: "#ffffff",
  color: "#0e0f0f",
  boxShadow: theme.shadows[24],
  padding: theme.spacing(3),
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    width: "95%",
    maxWidth: 340,
    padding: theme.spacing(2.5),
  },
  [`@media (max-width: 360px)`]: {
    width: "98%",
    maxWidth: 310,
    padding: theme.spacing(2),
  },
  [`@media (max-width: 320px)`]: {
    width: "98%",
    maxWidth: 290,
    padding: theme.spacing(1.5),
  },
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3.5),
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    gap: theme.spacing(1.5),
  },
  [`@media (max-width: 360px)`]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(1),
  },
  [`@media (max-width: 320px)`]: {
    padding: theme.spacing(1.2),
    gap: theme.spacing(0.8),
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 150,
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  "& .MuiInputBase-root": {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
    color: "#201548",
    paddingLeft: theme.spacing(1),
  },
  "& .MuiSelect-icon": {
    color: "#201548",
  },
  "&:hover": {
    "& .MuiInputBase-root": {
      backgroundColor: "#f5f5f5",
    },
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 130,
  },
  [`@media (max-width: 360px)`]: {
    minWidth: 110,
  },
  [`@media (max-width: 320px)`]: {
    minWidth: 100,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  minWidth: { xs: 210, sm: 300 },
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  "& .MuiInputBase-input": {
    fontSize: "0.9rem",
    color: "#0e0f0f",
    padding: theme.spacing(1.5),
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
    color: "#201548",
    paddingLeft: theme.spacing(1),
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#201548",
    },
    "&:hover fieldset": {
      borderColor: "#1a1138",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#201548",
    },
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 190,
  },
  [`@media (max-width: 360px)`]: {
    minWidth: 170,
  },
  [`@media (max-width: 320px)`]: {
    minWidth: 150,
  },
}));

const StyledResetButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#201548",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#1a1138",
  },
  fontSize: "0.85rem",
  padding: theme.spacing(1.2, 2.5),
  borderRadius: "8px",
  textTransform: "none",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
    padding: theme.spacing(1, 2),
  },
  [`@media (max-width: 360px)`]: {
    fontSize: "0.75rem",
    padding: theme.spacing(0.8, 1.5),
  },
  [`@media (max-width: 320px)`]: {
    fontSize: "0.7rem",
    padding: theme.spacing(0.7, 1.2),
  },
}));

const FilterToggleButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "block",
    color: "#201548",
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    padding: theme.spacing(1),
  },
  [`@media (max-width: 360px)`]: {
    padding: theme.spacing(0.8),
  },
  [`@media (max-width: 320px)`]: {
    padding: theme.spacing(0.6),
  },
}));

const EnquiryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#201548",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#1a1138",
  },
  fontSize: "0.85rem",
  padding: theme.spacing(1.2, 2.5),
  borderRadius: "8px",
  textTransform: "none",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
    padding: theme.spacing(1, 2),
  },
  [`@media (max-width: 360px)`]: {
    fontSize: "0.75rem",
    padding: theme.spacing(0.8, 1.5),
  },
  [`@media (max-width: 320px)`]: {
    fontSize: "0.7rem",
    padding: theme.spacing(0.7, 1.2),
  },
}));

const SendEnquiryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#201548",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#1a1138",
  },
  "&.Mui-disabled": {
    backgroundColor: "#cccccc",
    color: "#666666",
  },
  fontSize: "0.85rem",
  padding: theme.spacing(1, 2.5),
  borderRadius: "8px",
  textTransform: "none",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
    padding: theme.spacing(0.8, 2),
  },
  [`@media (max-width: 360px)`]: {
    fontSize: "0.75rem",
    padding: theme.spacing(0.7, 1.5),
  },
  [`@media (max-width: 320px)`]: {
    fontSize: "0.7rem",
    padding: theme.spacing(0.6, 1.2),
  },
}));

// Haversine formula and parseParlorLocation
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (
    !lat1 ||
    !lon1 ||
    !lat2 ||
    !lon2 ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return null;
  }
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return parseFloat(distance.toFixed(1));
};

const parseParlorLocation = (location) => {
  if (!location || typeof location !== "string") {
    return null;
  }
  const match = location.match(/Lat:\s*([\d.-]+),\s*Lon:\s*([\d.-]+)/i);
  if (!match) {
    return null;
  }
  const lat = parseFloat(match[1]);
  const lon = parseFloat(match[2]);
  if (isNaN(lat) || isNaN(lon)) {
    return null;
  }
  return { lat, lon };
};

// Fisher-Yates shuffle function
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// ParlorListItem component with enhanced image handling
const ParlorListItem = ({ parlor, onImageClick, userLocation }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const getGoogleMapsUrl = (location) => {
    const coords = parseParlorLocation(location);
    if (!coords) return "#";
    return `https://www.google.com/maps?q=${coords.lat},${coords.lon}`;
  };

  const getDistanceDisplay = () => {
    if (!userLocation) {
      return "Please set your location";
    }
    if (!parlor.location) {
      return "Unknown";
    }
    const parlorCoords = parseParlorLocation(parlor.location);
    if (!parlorCoords) return "Invalid parlor location";
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lon,
      parlorCoords.lat,
      parlorCoords.lon
    );
    if (distance === null) {
      return "Unknown";
    }
    return `${distance} km`;
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setCredentials({ identifier: "", password: "" });
    setError("");
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { identifier, password } = credentials;

    if (!identifier || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/login`,
        {
          identifier,
          password,
          role: "User",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", identifier);
        localStorage.setItem("userRole", "User");
        handleCloseModal();
        navigate("/bookslot", { state: { parlor } });
        window.location.reload();
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  const handleBooking = async () => {
    try {
      const email1 = localStorage.getItem("email");

      if (!email1) {
        alert("Login data not found. Please login first.");
        handleOpenModal();
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/users/check/login/${email1}`
      );

      if (response.status === 200 && response.data.loginData) {
        navigate("/bookslot", { state: { parlor } });
      } else {
        alert("Login data not found. Please login first.");
        handleOpenModal();
      }
    } catch (error) {
      alert(`Something went wrong: ${error.message || error}`);
      handleOpenModal();
    }
  };

  return (
    <>
      <StyledListItem onClick={handleBooking} sx={{ cursor: "pointer" }}>
        <ListItemAvatar>
          <StyledAvatar
            src={`${BASE_URL}/${parlor.image?.replace(/\\/g, "/")}`}
            alt={parlor.name}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                color: "#0e0f0f",
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                paddingLeft: "12px",
                [`@media (max-width: 360px)`]: {
                  fontSize: "0.85rem",
                },
                [`@media (max-width: 320px)`]: {
                  fontSize: "0.8rem",
                },
              }}
            >
              {parlor.name}
            </Typography>
          }
          secondary={
            <Box sx={{ paddingLeft: "12px" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#0e0f0f",
                  fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                  lineHeight: 1.4,
                  [`@media (max-width: 360px)`]: {
                    fontSize: "0.75rem",
                  },
                  [`@media (max-width: 320px)`]: {
                    fontSize: "0.7rem",
                  },
                }}
              >
                {parlor.designation} | {parlor.service}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#201548",
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                  lineHeight: 1.4,
                  [`@media (max-width: 360px)`]: {
                    fontSize: "0.75rem",
                  },
                  [`@media (max-width: 320px)`]: {
                    fontSize: "0.7rem",
                  },
                }}
              >
                ₹{parlor.price} | {parlor.style}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    color: "#0e0f0f",
                    lineHeight: 1.4,
                    [`@media (max-width: 360px)`]: {
                      fontSize: "0.75rem",
                    },
                    [`@media (max-width: 320px)`]: {
                      fontSize: "0.7rem",
                    },
                  }}
                >
                  {parlor.spRating}
                </Typography>
                <i
                  className="fa fa-star"
                  style={{
                    marginLeft: "6px",
                    color: "#fbc02d",
                    fontSize: "0.9rem",
                    [`@media (max-width: 360px)`]: {
                      fontSize: "0.75rem",
                    },
                    [`@media (max-width: 320px)`]: {
                      fontSize: "0.7rem",
                    },
                  }}
                ></i>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    ml: 1,
                    color: "#0e0f0f",
                    lineHeight: 1.4,
                    [`@media (max-width: 360px)`]: {
                      fontSize: "0.75rem",
                    },
                    [`@media (max-width: 320px)`]: {
                      fontSize: "0.7rem",
                    },
                  }}
                >
                  ({parlor.countPeople} Ratings)
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                  color: "#0e0f0f",
                  lineHeight: 1.4,
                  [`@media (max-width: 360px)`]: {
                    fontSize: "0.75rem",
                  },
                  [`@media (max-width: 320px)`]: {
                    fontSize: "0.7rem",
                  },
                }}
              >
                Distance: {getDistanceDisplay()}
              </Typography>
            </Box>
          }
        />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              window.open(getGoogleMapsUrl(parlor.location), "_blank");
            }}
            size="small"
          >
            <LocationOnIcon
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem" },
                [`@media (max-width: 320px)`]: { fontSize: "1.1rem" },
              }}
            />
          </ActionButton>
        </Box>
      </StyledListItem>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="login-modal-title"
        sx={{
          backdropFilter: "blur(5px)",
        }}
      >
        <ModalContent>
          <Typography
            id="login-modal-title"
            variant="h5"
            component="h2"
            textAlign="center"
            sx={{
              fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.5rem" },
              color: "#0e0f0f",
              fontWeight: "bold",
              paddingBottom: "8px",
              [`@media (max-width: 360px)`]: {
                fontSize: "1.2rem",
              },
              [`@media (max-width: 320px)`]: {
                fontSize: "1.1rem",
              },
            }}
          >
            User Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email or Phone"
              variant="outlined"
              name="identifier"
              value={credentials.identifier}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              sx={{
                "& .MuiInputBase-input": {
                  padding: "12px",
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                },
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                },
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "12px",
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                },
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                },
              }}
            />
            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  padding: "8px 12px",
                  [`@media (max-width: 320px)`]: { fontSize: "0.75rem" },
                }}
              >
                {error}
              </Typography>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#201548",
                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  padding: "4px 12px",
                  [`@media (max-width: 320px)`]: { fontSize: "0.75rem" },
                }}
              >
                Forgot Password?
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#201548",
                  color: "#ffffff",
                  "&:hover": { backgroundColor: "#1a1138" },
                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  padding: { xs: "8px 20px", sm: "10px 24px" },
                  borderRadius: "8px",
                  textTransform: "none",
                  [`@media (max-width: 320px)`]: {
                    fontSize: "0.75rem",
                    padding: "6px 16px",
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{
                  borderColor: "#201548",
                  color: "#201548",
                  "&:hover": { borderColor: "#1a1138", color: "#1a1138" },
                  fontSize: { xs: "0.8rem", sm: "0.85rem" },
                  padding: { xs: "8px 20px", sm: "10px 24px" },
                  borderRadius: "8px",
                  textTransform: "none",
                  [`@media (max-width: 320px)`]: {
                    fontSize: "0.75rem",
                    padding: "6px 16px",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
            <Typography
              textAlign="center"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                mt: 2,
                color: "#0e0f0f",
                padding: "8px 12px",
                [`@media (max-width: 320px)`]: { fontSize: "0.75rem" },
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "#201548" }}
              >
                Sign up
              </Link>
            </Typography>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

// Google Maps Autocomplete hook
const useGoogleMapsAutocomplete = (
  inputRef,
  setLocationInput,
  setUserLocation
) => {
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (
        window.google &&
        window.google.maps &&
        window.google.maps.places &&
        inputRef.current
      ) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: ["formatted_address", "geometry", "name"],
            types: [],
          }
        );

        const listener = autocompleteRef.current.addListener(
          "place_changed",
          () => {
            const place = autocompleteRef.current.getPlace();
            if (!place.geometry || !place.geometry.location) {
              alert(`No details available for input: '${place.name}'`);
              setLocationInput("");
              setUserLocation(null);
              return;
            }
            setLocationInput(place.formatted_address);
            setUserLocation({
              lat: place.geometry.location.lat(),
              lon: place.geometry.location.lng(),
            });
          }
        );

        return () => {
          if (window.google && window.google.maps) {
            window.google.maps.event.removeListener(listener);
          }
        };
      } else {
        return setTimeout(initializeAutocomplete, 100);
      }
    };

    const timeoutId = initializeAutocomplete();

    return () => {
      clearTimeout(timeoutId);
      if (autocompleteRef.current && window.google && window.google.maps) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [inputRef, setLocationInput, setUserLocation]);
};

const Product = () => {
  const [selectedParlor, setSelectedParlor] = useState(null);
  const [detailedParlor, setDetailedParlor] = useState(null);
  const [beautyParlors, setBeautyParlors] = useState([]);
  const [filteredParlors, setFilteredParlors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const autocompleteInputRef = useRef(null);
  const modalRef = useRef(null);

  useGoogleMapsAutocomplete(
    autocompleteInputRef,
    setLocationInput,
    setUserLocation
  );

  // Fetch service providers for enquiry modal
  useEffect(() => {
    if (enquiryModalOpen && userLocation) {
      const fetchServiceProviders = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/main/admin/get/all/service-providers`
          );
          const parsedProviders = response.data.map((provider) => ({
            _id: provider._id || "",
            shopName: provider.shopName || "No Name",
            designation: provider.designation || "Salon",
            location: provider.location || null,
            spRating: parseFloat(provider.spRating) || 0,
            email: provider.email || "No Email",
          }));
          const filteredProviders = parsedProviders.filter((provider) => {
            const providerCoords = parseParlorLocation(provider.location);
            if (!providerCoords) return false;
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lon,
              providerCoords.lat,
              providerCoords.lon
            );
            return distance !== null && distance <= 20;
          });
          setServiceProviders(filteredProviders);
        } catch (error) {
          console.error("Failed to fetch service providers:", error);
          setServiceProviders([]);
        }
      };
      fetchServiceProviders();
    } else if (enquiryModalOpen && !userLocation) {
      setServiceProviders([]);
    }
  }, [enquiryModalOpen, userLocation]);

  // Handle enquiry submission
  const handleSubmitEnquiry = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      alert("Please login to submit an enquiry.");
      navigate("/login");
      return;
    }
    if (!enquiryMessage) {
      alert("Please enter a message to send the enquiry.");
      return;
    }
    if (!selectedDesignation) {
      alert("Please select a designation to send the enquiry.");
      return;
    }

    const filteredProviders = serviceProviders.filter(
      (provider) => provider.designation === selectedDesignation
    );

    if (filteredProviders.length === 0) {
      alert(
        `No service providers available in your area for ${selectedDesignation}.`
      );
      return;
    }

    try {
      const promises = filteredProviders.map((provider) =>
        axios.post(`${BASE_URL}/api/users/enquiries`, {
          parlorEmail: provider.email,
          message: enquiryMessage,
          email,
        })
      );

      const responses = await Promise.all(promises);

      const allSuccessful = responses.every(
        (response) => response.status === 201
      );

      if (allSuccessful) {
        setSuccessDialogOpen(true);
      } else {
        alert("Some enquiries failed to send. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting enquiries:", error);
      alert("Failed to send enquiries. Please try again.");
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setEnquiryModalOpen(false);
    setEnquiryMessage("");
    setSelectedDesignation("");
  };

  const handleEnquiryButtonClick = () => {
    if (!userLocation) {
      alert("Please set your location to proceed with the enquiry.");
      return;
    }
    setEnquiryModalOpen(true);
  };

  const roleOptions = {
    Salon: ["HairCut", "Facial", "HairColor", "Shaving"],
    Beauty_Parler: ["HairCut", "Bridal", "Waxing", "Pedicure"],
    Doctor: ["Hair Treatment", "Skin Treatment"],
  };

  const allServices = Array.from(
    new Set([
      ...roleOptions.Salon,
      ...roleOptions.Beauty_Parler,
      ...roleOptions.Doctor,
    ])
  );

  const ratingOptions = [
    { value: "all", label: "All Ratings", range: [0, 5] },
    { value: "1-1.9", label: "1+", stars: "★", range: [1, 1.9] },
    { value: "2-2.9", label: "2+", stars: "★★", range: [2, 2.9] },
    { value: "3-3.9", label: "3+", stars: "★★★", range: [3, 3.9] },
    { value: "4-4.9", label: "4+", stars: "★★★★", range: [4, 4.9] },
    { value: "5", label: "5", stars: "★★★★★", range: [5, 5] },
  ];

  const getActiveDesignation = () => {
    if (location.state?.designation) {
      return location.state.designation;
    }
    const path = location.pathname.toLowerCase();
    if (path.includes("salon")) return "Salon";
    if (path.includes("beauty")) return "Beauty_Parler";
    if (path.includes("skincare")) return "Doctor";
    return "";
  };

  const getGoogleMapsUrlFromCoords = (lat, lon) => {
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      return "#";
    }
    return `https://www.google.com/maps?q=${lat},${lon}`;
  };

  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch service providers
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/users/cards/services`)
      .then((response) => {
        const parsed = response.data.map((item, index) => ({
          id: index + 1,
          name: item.shopName || "No Name",
          image: item.shopImage || null,
          location: item.location || null,
          service: item.serviceName || "Service",
          style: item.style || "No Style",
          email: item.email || "No Email",
          serviceId: item.serviceId || "No Service ID",
          price: item.price || 0,
          designation: item.designation || "Salon",
          countPeople: item.countPeople || 0,
          spRating: parseFloat(item.spRating) || 0,
          priority: parseInt(item.priority) || 0,
        }));
        setBeautyParlors(parsed);
        setFilteredParlors(parsed);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch parlors:", error);
        alert("Failed to load services. Please try again later.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const newDesignation = getActiveDesignation();
    const newService = location.state?.service || "";
    setDesignationFilter(newDesignation);
    setServiceFilter(newService);
  }, [location.pathname, location.state]);

  // Apply filters and sort
  useEffect(() => {
    let filtered = beautyParlors;

    if (designationFilter && designationFilter !== "All Products") {
      filtered = filtered.filter(
        (parlor) => parlor.designation === designationFilter
      );
    }

    if (ratingFilter !== "all") {
      const selectedRange = ratingOptions.find(
        (option) => option.value === ratingFilter
      )?.range;
      if (selectedRange) {
        filtered = filtered.filter(
          (parlor) =>
            parlor.spRating >= selectedRange[0] &&
            parlor.spRating <= selectedRange[1]
        );
      }
    }

    if (distanceFilter !== "all" && userLocation) {
      filtered = filtered.filter((parlor) => {
        const parlorCoords = parseParlorLocation(parlor.location);
        if (!parlorCoords) {
          return false;
        }
        const dist = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          parlorCoords.lat,
          parlorCoords.lon
        );
        if (dist === null) return false;
        if (distanceFilter === "0-1") return dist <= 1;
        if (distanceFilter === "0-3") return dist > 0 && dist <= 3;
        if (distanceFilter === "0-5") return dist > 0 && dist <= 5;
        if (distanceFilter === "more") return dist > 5;
        return true;
      });
    }

    if (serviceFilter) {
      filtered = filtered.filter((parlor) => parlor.service === serviceFilter);
    }

    const prioritized = filtered
      .filter((parlor) => parlor.priority > 0)
      .sort((a, b) => b.priority - a.priority);
    const nonPrioritized = filtered.filter((parlor) => parlor.priority === 0);
    const shuffledNonPrioritized = shuffleArray(nonPrioritized);
    const finalOrder = [...prioritized, ...shuffledNonPrioritized];

    setFilteredParlors(finalOrder);
  }, [
    beautyParlors,
    designationFilter,
    ratingFilter,
    distanceFilter,
    serviceFilter,
    userLocation,
  ]);

  const handleRatingChange = (event) => {
    setRatingFilter(event.target.value);
  };

  const handleDistanceChange = (event) => {
    setDistanceFilter(event.target.value);
  };

  const handleServiceChange = (event) => {
    setServiceFilter(event.target.value);
  };

  const handleDesignationChange = (event) => {
    setDesignationFilter(event.target.value);
    setServiceFilter("");
  };

  const handleResetFilters = () => {
    setRatingFilter("all");
    setDistanceFilter("all");
    setServiceFilter("");
    setDesignationFilter("");
    setLocationInput("");
    setUserLocation(null);
    setShowFilters(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        py: { xs: 4, sm: 5 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3 },
          maxWidth: {
            xs: "100%",
            sm: "95%",
            md: "1200px",
            lg: "1400px",
          },
        }}
      >
        <style>
          {`
          h2.text-primary {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 2.2rem;
            background: linear-gradient(90deg, #201548, #1a1138);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            position: relative;
            margin-bottom: 2rem;
            text-align: center;
            letter-spacing: 0.8px;
          }

          h2.text-primary::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3.5px;
            background: linear-gradient(90deg, #201548, #1a1138);
            borderRadius: 2px;
          }

          @media (max-width: 600px) {
            h2.text-primary {
              font-size: 1.8rem;
            }
            h2.text-primary::after {
              width: 70px;
              bottom: -8px;
            }
          }

          @media (max-width: 360px) {
            h2.text-primary {
              font-size: 1.6rem;
            }
            h2.text-primary::after {
              width: 60px;
            }
          }

          @media (max-width: 320px) {
            h2.text-primary {
              font-size: 1.4rem;
            }
            h2.text-primary::after {
              width: 50px;
            }
          }
          `}
        </style>
        <h2
          className="text-primary fw-bold mb-4 animate__animated animate__fadeInDown"
          style={{
            animationDuration: "1s",
            fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2rem" },
            textTransform: "uppercase",
          }}
        >
          Our Services
        </h2>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <FilterToggleButton onClick={handleToggleFilters}>
            <FilterListIcon
              sx={{
                fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.5rem" },
                [`@media (max-width: 320px)`]: { fontSize: "1.2rem" },
              }}
            />
          </FilterToggleButton>
        </Box>
        {(showFilters || window.innerWidth >= 600) && (
          <FilterContainer>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <StyledTextField
                label="Your Location"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                inputRef={autocompleteInputRef}
                placeholder="Search for any place (e.g., college, shop)"
                className="mt-2"
              />
              <IconButton
                onClick={() =>
                  window.open(
                    getGoogleMapsUrlFromCoords(
                      userLocation?.lat,
                      userLocation?.lon
                    ),
                    "_blank"
                  )
                }
                disabled={!userLocation}
                sx={{
                  color: "#201548",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  p: { xs: 1, sm: 1.2 },
                  [`@media (max-width: 320px)`]: { p: 0.8 },
                }}
              >
                <i
                  className="fa fa-map"
                  style={{
                    fontSize: { xs: "1.1rem", sm: "1.2rem" },
                    [`@media (max-width: 320px)`]: { fontSize: "1rem" },
                  }}
                ></i>
              </IconButton>
            </Box>
            <StyledFormControl className="mt-2">
              <InputLabel>Designation</InputLabel>
              <Select
                value={designationFilter}
                onChange={handleDesignationChange}
                label="Designation"
                sx={{
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                }}
              >
                <MenuItem value="All Products">All Products</MenuItem>
                <MenuItem value="Salon">Salon</MenuItem>
                <MenuItem value="Beauty_Parler">Beauty Parlor</MenuItem>
                <MenuItem value="Doctor">Doctor</MenuItem>
              </Select>
            </StyledFormControl>
            <StyledFormControl className="mt-2">
              <InputLabel>Rating</InputLabel>
              <Select
                value={ratingFilter}
                onChange={handleRatingChange}
                label="Rating"
                sx={{
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                }}
              >
                {ratingOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        sx={{
                          color: "#fbc02d",
                          mr: 1,
                          fontSize: { xs: "0.85rem", sm: "0.9rem" },
                          [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                        }}
                      >
                        {option.stars}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.85rem", sm: "0.9rem" },
                          [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                        }}
                      >
                        {option.label}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <StyledFormControl className="mt-2">
              <InputLabel>Distance</InputLabel>
              <Select
                value={distanceFilter}
                onChange={handleDistanceChange}
                label="Distance"
                sx={{
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="0-1">0-1 km</MenuItem>
                <MenuItem value="0-3">0-3 km</MenuItem>
                <MenuItem value="0-5">0-5 km</MenuItem>
                <MenuItem value="more">More than 5 km</MenuItem>
              </Select>
            </StyledFormControl>
            <StyledFormControl className="mt-2">
              <InputLabel>Service</InputLabel>
              <Select
                value={serviceFilter}
                onChange={handleServiceChange}
                label="Service"
                sx={{
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                }}
              >
                <MenuItem value="">All Services</MenuItem>
                {(designationFilter === "All Products"
                  ? allServices
                  : roleOptions[designationFilter] || []
                ).map((service) => (
                  <MenuItem key={service} value={service}>
                    {service}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <StyledResetButton
              variant="contained"
              onClick={handleResetFilters}
              className="mt-2"
            >
              Reset
            </StyledResetButton>
            <EnquiryButton
              variant="contained"
              onClick={handleEnquiryButtonClick}
              className="mt-2"
            >
              Enquiry
            </EnquiryButton>
          </FilterContainer>
        )}
        <List
          sx={{
            width: "100%",
            bgcolor: "transparent",
            borderRadius: "12px",
            p: { xs: 2, sm: 2.5 },
            [`@media (max-width: 320px)`]: { p: 1.5 },
          }}
        >
          {loading ? (
            <Typography
              variant="h6"
              align="center"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                color: "#201548",
                padding: "16px",
                [`@media (max-width: 360px)`]: { fontSize: "0.85rem" },
                [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
              }}
            >
              Loading...
            </Typography>
          ) : filteredParlors.length === 0 ? (
            <Typography
              variant="h6"
              align="center"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                color: "#201548",
                padding: "16px",
                [`@media (max-width: 360px)`]: { fontSize: "0.85rem" },
                [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
              }}
            >
              Services Not Found
            </Typography>
          ) : (
            filteredParlors.map((parlor) => (
              <ParlorListItem
                key={parlor.id}
                parlor={parlor}
                onImageClick={setDetailedParlor}
                userLocation={userLocation}
              />
            ))
          )}
        </List>

        {/* Enquiry Modal */}
        {enquiryModalOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1050,
            }}
          >
            <motion.div
              ref={modalRef}
              className="bg-white rounded-4 shadow-lg p-4 mx-3"
              style={{
                maxWidth: "600px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3
                  className="m-0"
                  style={{
                    color: "#201548",
                    fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.5rem" },
                    [`@media (max-width: 360px)`]: { fontSize: "1.2rem" },
                    [`@media (max-width: 320px)`]: { fontSize: "1.1rem" },
                  }}
                >
                  Service Enquiry
                </h3>
                <button
                  className="btn border-0"
                  onClick={handleCloseModal}
                  style={{ color: "#201548" }}
                >
                  <i
                    className="bi bi-x-lg"
                    style={{
                      fontSize: { xs: "1.1rem", sm: "1.2rem" },
                      [`@media (max-width: 320px)`]: { fontSize: "1rem" },
                    }}
                  ></i>
                </button>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark">
                  Select Designation
                </label>
                <StyledFormControl fullWidth>
                  <InputLabel>Designation</InputLabel>
                  <Select
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                    label="Designation"
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem" },
                      [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                    }}
                  >
                    <MenuItem value="">Select Designation</MenuItem>
                    <MenuItem value="Salon">Salon</MenuItem>
                    <MenuItem value="Beauty_Parler">Beauty Parlor</MenuItem>
                    <MenuItem value="Doctor">Doctor</MenuItem>
                  </Select>
                </StyledFormControl>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark">
                  Service Providers
                </label>
                {selectedDesignation &&
                serviceProviders.filter(
                  (provider) => provider.designation === selectedDesignation
                ).length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontStyle: "italic",
                      fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      padding: "8px 12px",
                      [`@media (max-width: 320px)`]: { fontSize: "0.75rem" },
                    }}
                  >
                    No providers found for {selectedDesignation}
                  </Typography>
                ) : !selectedDesignation ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontStyle: "italic",
                      fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      padding: "8px 12px",
                      [`@media (max-width: 320px)`]: { fontSize: "0.75rem" },
                    }}
                  >
                    Please select a designation
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      p: 1.5,
                      bgcolor: "#fafafa",
                      [`@media (max-width: 320px)`]: {
                        maxHeight: "180px",
                        p: 1,
                      },
                    }}
                  >
                    {serviceProviders
                      .filter(
                        (provider) =>
                          provider.designation === selectedDesignation
                      )
                      .map((provider) => {
                        const providerCoords = parseParlorLocation(
                          provider.location
                        );
                        const distance = providerCoords
                          ? calculateDistance(
                              userLocation.lat,
                              userLocation.lon,
                              providerCoords.lat,
                              providerCoords.lon
                            )
                          : null;
                        return (
                          <Box
                            key={provider._id}
                            sx={{
                              p: 1.5,
                              borderBottom: "1px solid #e0e0e0",
                              "&:last-child": { borderBottom: "none" },
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              mb: 0.5,
                              [`@media (max-width: 320px)`]: { p: 1 },
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: "#201548",
                                fontSize: {
                                  xs: "0.85rem",
                                  sm: "0.9rem",
                                  md: "0.95rem",
                                },
                                [`@media (max-width: 320px)`]: {
                                  fontSize: "0.8rem",
                                },
                              }}
                            >
                              {provider.shopName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#0e0f0f",
                                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                [`@media (max-width: 320px)`]: {
                                  fontSize: "0.75rem",
                                },
                              }}
                            >
                              {provider.designation} | Rating:{" "}
                              {provider.spRating}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#666",
                                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                [`@media (max-width: 320px)`]: {
                                  fontSize: "0.75rem",
                                },
                              }}
                            >
                              Distance: {distance || "Unknown"} km
                            </Typography>
                          </Box>
                        );
                      })}
                  </Box>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="enquiryMessage"
                  className="form-label fw-semibold text-dark"
                  style={{
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
                  }}
                >
                  Your Message
                </label>
                <textarea
                  id="enquiryMessage"
                  className="form-control"
                  rows="5"
                  placeholder="Please describe what services you're interested in..."
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  style={{
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    padding: "12px",
                    borderRadius: "8px",
                    [`@media (max-width: 320px)`]: {
                      fontSize: "0.8rem",
                      padding: "10px",
                    },
                  }}
                ></textarea>
              </div>

              <div className="d-flex gap-3 justify-content-end flex-wrap">
                <SendEnquiryButton
                  onClick={handleSubmitEnquiry}
                  disabled={
                    !enquiryMessage ||
                    !selectedDesignation ||
                    serviceProviders.filter(
                      (provider) => provider.designation === selectedDesignation
                    ).length === 0
                  }
                >
                  Send Enquiry
                </SendEnquiryButton>
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  sx={{
                    borderColor: "#201548",
                    color: "#201548",
                    "&:hover": { borderColor: "#1a1138", color: "#1a1138" },
                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                    padding: { xs: "8px 20px", sm: "10px 24px" },
                    borderRadius: "8px",
                    textTransform: "none",
                    [`@media (max-width: 320px)`]: {
                      fontSize: "0.75rem",
                      padding: "6px 16px",
                    },
                  }}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Dialog */}
        <Dialog
          open={successDialogOpen}
          onClose={handleSuccessDialogClose}
          aria-labelledby="success-dialog-title"
          PaperProps={{
            sx: {
              borderRadius: "12px",
              padding: { xs: "12px", sm: "16px" },
              [`@media (max-width: 320px)`]: { padding: "10px" },
            },
          }}
        >
          <DialogTitle
            id="success-dialog-title"
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.4rem" },
              color: "#201548",
              padding: "12px 16px",
              [`@media (max-width: 320px)`]: { fontSize: "1rem" },
            }}
          >
            Success
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                color: "#0e0f0f",
                padding: "8px 12px",
                [`@media (max-width: 320px)`]: { fontSize: "0.8rem" },
              }}
            >
              Enquiry sent successfully to all {selectedDesignation} providers!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleSuccessDialogClose}
              sx={{
                backgroundColor: "#201548",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#1a1138" },
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                padding: { xs: "8px 20px", sm: "10px 24px" },
                borderRadius: "8px",
                textTransform: "none",
                [`@media (max-width: 320px)`]: {
                  fontSize: "0.75rem",
                  padding: "6px 16px",
                },
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Product;
