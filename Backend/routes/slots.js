// backend/routes/slots.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Shop = require("../models/SpSchema");

// Helper to generate time slots (matches BookSlot.js)
const generateTimeSlots = (startTime, endTime, interval = 60) => {
  const slots = [];
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  for (let time = start; time < end; time += interval) {
    const slotStart = formatTime(time);
    const slotEnd = formatTime(time + interval);
    slots.push(`${slotStart}-${slotEnd}`);
  }
  return slots;
};

// Get available slots
router.get("/available", async (req, res) => {
  try {
    const { parlorEmail, service, date, favoriteEmployee, duration } = req.query;

    // Validate required parameters
    if (!parlorEmail || !service || !date) {
      return res.status(400).json({
        message: "Missing required parameters: parlorEmail, service, date",
      });
    }

    // Default duration if not provided
    const durationNum = parseInt(duration, 10) || 60;

    // Normalize date to YYYY-MM-DD
    const normalizedDate = new Date(date).toISOString().split("T")[0];

    // Fetch parlor timings
    const parlor = await Shop.findOne({ email: parlorEmail });
    if (!parlor || !parlor.availableTime?.fromTime || !parlor.availableTime?.toTime) {
      return res.status(400).json({ message: "Parlor timings not available" });
    }

    // Generate time slots
    const { fromTime, toTime } = parlor.availableTime;
    const allSlots = generateTimeSlots(fromTime, toTime, 60);

    // Build query for booked slots
    const query = {
      "bookings.parlorName": parlor.name,
      "bookings.service": service,
      "bookings.date": normalizedDate,
      "bookings.paymentStatus": "PAID",
      "bookings.confirmed": { $ne: "Cancelled" },
    };
    if (favoriteEmployee) {
      query["bookings.favoriteEmployee"] = favoriteEmployee;
    }

    // Find booked slots
    const users = await User.find(query);
    const bookedSlots = users
      .flatMap((user) => user.bookings)
      .filter(
        (booking) =>
          booking.parlorName === parlor.name &&
          booking.service === service &&
          booking.date === normalizedDate &&
          booking.paymentStatus === "PAID" &&
          booking.confirmed !== "Cancelled" &&
          (!favoriteEmployee || booking.favoriteEmployee === favoriteEmployee)
      )
      .map((booking) => ({
        time: booking.time,
        duration: booking.duration || 60,
      }));

    // Filter available slots considering duration
    const timeToMinutes = (time) => {
      const [start] = time.split("-");
      const [hours, minutes] = start.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const availableSlots = allSlots.filter((slot) => {
      const slotStart = timeToMinutes(slot);
      const slotEnd = slotStart + durationNum;

      for (const booked of bookedSlots) {
        const bookedStart = timeToMinutes(booked.time);
        const bookedEnd = bookedStart + booked.duration;

        if (!(slotEnd <= bookedStart || slotStart >= bookedEnd)) {
          return false;
        }
      }
      return true;
    });

    res.json({ slots: availableSlots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;