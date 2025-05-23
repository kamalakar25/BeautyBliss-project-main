const express = require("express");
const router = express.Router();
const User = require("../models/user");
const SalonShop = require("../models/SpSchema");
const Notification = require("../models/Notification");

const nodemailer = require("nodemailer");

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "bharathmuntha27@gmail.com", // Use environment variable
    pass: process.env.EMAIL_PASS || "rpho wwtl lcqe gopb", // Use environment variable for App Password
  },
});

// Create notification for user and SP when a booking is made
router.post("/create-booking-notification", async (req, res) => {
  const { userEmail, parlorEmail, bookingId } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const salonShop = await SalonShop.findOne({ email: parlorEmail });
    if (!salonShop)
      return res.status(404).json({ message: "Service provider not found" });

    const booking = user.bookings.id(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // User notification
    const userNotification = new Notification({
      recipientEmail: userEmail,
      recipientType: "User",
      type: "Booking",
      title: "Booking Confirmed",
      message: `Your booking for ${booking.service} on ${new Date(
        booking.date
      ).toLocaleDateString()} at ${booking.time} is confirmed.`,
      bookingId,
      userDetails: { name: user.name, email: user.email, phone: user.phone },
    });

    // Service provider notification
    const spNotification = new Notification({
      recipientEmail: parlorEmail,
      recipientType: "ServiceProvider",
      type: "Booking",
      title: "New Booking",
      message: `New booking for ${booking.service} by ${
        user.name
      } on ${new Date(booking.date).toLocaleDateString()} at ${booking.time}.`,
      bookingId,
      userDetails: { name: user.name, email: user.email, phone: user.phone },
    });

    await userNotification.save();
    await spNotification.save();

    // Send email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER || "bharathmuntha27@gmail.com",
      to: userEmail,
      subject: "Booking Confirmation",
      html: `
        <h3>Hello ${user.name},</h3>
        <p>Your booking has been confirmed!</p>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Date:</strong> ${new Date(
          booking.date
        ).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p>Thank you for booking with ${salonShop.shopName}.</p>
        <p>Best regards,</p>
        <p>Your Platform Team</p>
      `,
    };
    await transporter.sendMail(userMailOptions);

    // Send email to service provider
    const spMailOptions = {
      from: process.env.EMAIL_USER || "bharathmuntha27@gmail.com",
      to: parlorEmail,
      subject: "New Booking Notification",
      html: `
        <h3>Hello ${salonShop.name},</h3>
        <p>You have a new booking!</p>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Customer:</strong> ${user.name}</p>
        <p><strong>Date:</strong> ${new Date(
          booking.date
        ).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Customer Email:</strong> ${user.email}</p>
        <p><strong>Customer Phone:</strong> ${user.phone || "N/A"}</p>
        <p>Please log in to your account to confirm or manage this booking.</p>
        <p>Best regards,</p>
        <p>Your Platform Team</p>
      `,
    };

    await transporter.sendMail(spMailOptions);

    res.json({ message: "Booking notifications created" });
  } catch (error) {
    // console.error("Error creating booking notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create notification for users and SP when a new service is added
router.post("/create-service-notification", async (req, res) => {
  const { parlorEmail, serviceId, serviceName } = req.body;

  try {
    const salonShop = await SalonShop.findOne({ email: parlorEmail });
    if (!salonShop)
      return res.status(404).json({ message: "Service provider not found" });

    // Notify all users
    const users = await User.find({ designation: "Customer" });
    const userNotifications = users.map((user) => ({
      recipientEmail: user.email,
      recipientType: "User",
      type: "NewService",
      title: "New Service Available",
      message: `Check out the new service "${serviceName}" offered by ${salonShop.shopName}!`,
      serviceId,
    }));

    // Notify the service provider
    const spNotification = {
      recipientEmail: parlorEmail,
      recipientType: "ServiceProvider",
      type: "NewService",
      title: "Service Added",
      message: `You have successfully added the new service "${serviceName}".`,
      serviceId,
    };

    await Notification.insertMany([...userNotifications, spNotification]);

    // Send emails to users
    for (const user of users) {
      const userMailOptions = {
        from: process.env.EMAIL_USER || "bharathmuntha27@gmail.com",
        to: user.email,
        subject: "New Service Available",
        html: `
          <h3>Hello ${user.name},</h3>
          <p>A new service is available!</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Offered by:</strong> ${salonShop.shopName}</p>
          <p><strong>Service ID:</strong> ${serviceId}</p>
          <p>Log in to explore this new service.</p>
          <p>Best regards,</p>
          <p>Your Platform Team</p>
        `,
      };
      await transporter.sendMail(userMailOptions);
    }

    // Send email to service provider
    const spMailOptions = {
      from: process.env.EMAIL_USER || "bharathmuntha27@gmail.com",
      to: parlorEmail,
      subject: "New Service Added",
      html: `
        <h3>Hello ${salonShop.name},</h3>
        <p>You have successfully added a new service!</p>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Service ID:</strong> ${serviceId}</p>
        <p>This service is now available to customers.</p>
        <p>Best regards,</p>
        <p>Your Platform Team</p>
      `,
    };

    await transporter.sendMail(spMailOptions);

    res.json({ message: "Service notifications created" });
  } catch (error) {
    // console.error("Error creating service notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark notification as read
router.post("/mark-notification-read", async (req, res) => {
  const { email, notificationId } = req.body;

  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipientEmail: email,
    });
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    notification.isRead = true;
    await notification.save();

    const unreadCount = await Notification.countDocuments({
      recipientEmail: email,
      isRead: false,
    });

    res.json({ message: "Notification marked as read", unreadCount });
  } catch (error) {
    // console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark booking as confirmed (for SP)
router.post("/sp/mark-booking-confirmed", async (req, res) => {
  const { email, bookingId } = req.body;

  try {
    const salonShop = await SalonShop.findOne({ email });
    if (!salonShop)
      return res.status(404).json({ message: "Service provider not found" });

    const user = await User.findOne({ "bookings._id": bookingId });
    if (!user) return res.status(404).json({ message: "Booking not found" });

    const booking = user.bookings.id(bookingId);
    if (!booking || booking.parlorEmail !== email) {
      return res
        .status(404)
        .json({
          message:
            "Booking not found or not associated with this service provider",
        });
    }

    booking.confirmed = true;
    await user.save();

    // Update SP notification to reflect confirmation
    await Notification.updateOne(
      { bookingId, recipientEmail: email, recipientType: "ServiceProvider" },
      {
        title: "Booking Confirmed",
        message: `You confirmed the booking for ${booking.service}.`,
      }
    );

    // Notify user of confirmation
    const userNotification = new Notification({
      recipientEmail: user.email,
      recipientType: "User",
      type: "Booking",
      title: "Booking Confirmed by Provider",
      message: `Your booking for ${booking.service} on ${new Date(
        booking.date
      ).toLocaleDateString()} at ${booking.time} has been confirmed by ${
        salonShop.shopName
      }.`,
      bookingId,
      userDetails: { name: user.name, email: user.email, phone: user.phone },
    });

    await userNotification.save();

    // Send email to service provider
    const spMailOptions = {
      from: process.env.EMAIL_USER || "bharathmuntha27@gmail.com",
      to: email,
      subject: "Booking Confirmation",
      html: `
        <h3>Hello ${salonShop.name},</h3>
        <p>You have confirmed a booking!</p>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Customer:</strong> ${user.name}</p>
        <p><strong>Date:</strong> ${new Date(
          booking.date
        ).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p>Thank you for your confirmation.</p>
        <p>Best regards,</p>
        <p>Your Platform Team</p>
      `,
    };

    await transporter.sendMail(spMailOptions);

    // Send email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER || "bharathmuntha27@gmail.com",
      to: user.email,
      subject: "Booking Confirmed by Provider",
      html: `
        <h3>Hello ${user.name},</h3>
        <p>Your booking has been confirmed by ${salonShop.shopName}!</p>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Date:</strong> ${new Date(
          booking.date
        ).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p>Thank you for choosing our platform.</p>
        <p>Best regards,</p>
        <p>Your Platform Team</p>
      `,
    };

    await transporter.sendMail(userMailOptions);

    const unreadCount = await Notification.countDocuments({
      recipientEmail: email,
      isRead: false,
    });

    res.json({ message: "Booking confirmed", unreadCount });
  } catch (error) {
    // console.error("Error marking booking as confirmed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch notifications for a recipient
router.get("/notifications/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const notifications = await Notification.find({ recipientEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    res.json(notifications);
  } catch (error) {
    // console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch unread notification count
router.get("/notification-count/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const unreadCount = await Notification.countDocuments({
      recipientEmail: email,
      isRead: false,
    });

    res.json({ unreadCount });
  } catch (error) {
    // console.error("Error fetching notification count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
