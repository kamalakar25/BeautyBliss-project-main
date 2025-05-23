const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Shop = require("../models/SpSchema");

const nodemailer = require("nodemailer");

// Reschedule a booking
router.post("/reschedule/booking", async (req, res) => {
  try {
    const { email, orderId, newDate, newTime, favoriteEmployee } = req.body;

    if (!email || !orderId || !newDate || !newTime || !favoriteEmployee) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the booking
    const booking = user.bookings.find((b) => b.orderId === orderId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the new slot is available
    const conflictingBookings = await User.find({
      "bookings.parlorName": booking.parlorName,
      "bookings.service": booking.service,
      "bookings.date": newDate,
      "bookings.time": newTime,
      "bookings.favoriteEmployee": favoriteEmployee,
      "bookings.paymentStatus": "PAID",
      "bookings.confirmed": { $ne: "Cancelled" },
    });

    if (conflictingBookings.length > 0) {
      return res
        .status(400)
        .json({ message: "Selected slot is already booked" });
    }

    // Update the booking
    booking.date = newDate;
    booking.time = newTime;
    booking.favoriteEmployee = favoriteEmployee;

    await user.save();

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login for both user and admin
router.post("/login", async (req, res) => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const Model = role === "User" ? User : Shop;
    const user = await Model.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: `${role} not found` });
    }

    if (role !== "User" && user.approvals === false) {
      return res.status(401).json({
        message: "Your account is pending approval. Please wait for approval.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role === "User") {
      user.login = true;
      await user.save();
    }

    res.status(200).json({
      email: user.email,
      message: `${role} logged in successfully`,
    });
  } catch (err) {
    // console.error('Error during login:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Check login status
router.get("/check/login/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ loginData: user.login });
  } catch (err) {
    // console.error('Error during login check:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, gender, phone, dob, designation, password, bookings } =
      req.body;

    const newUser = new User({
      name,
      email,
      gender,
      phone,
      dob,
      designation,
      password,
      bookings: bookings || [],
    });

    await newUser.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    // console.error('Error registering user:', err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Add a booking for a user
router.post("/:email/bookings", async (req, res) => {
  try {
    const { email } = req.params;
    const {
      parlorEmail,
      parlorName,
      name,
      date,
      time,
      service,
      amount,
      relatedServices,
      favoriteEmployee,
      total_amount,
      Payment_Mode,
      orderId,
    } = req.body;

    if (
      !parlorEmail ||
      !parlorName ||
      !name ||
      !date ||
      !time ||
      !service ||
      !amount ||
      !total_amount ||
      !orderId
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookingData = {
      parlorEmail,
      parlorName,
      name,
      date,
      time,
      service,
      amount,
      total_amount,
      Payment_Mode,
      orderId,
      relatedServices: relatedServices || [],
      favoriteEmployee: favoriteEmployee || "",
      createdAt: new Date(),
      paymentStatus: "PENDING",
      confirmed: "Pending",
      refundedAmount: 0,
      refundStatus: "NONE",
    };

    user.bookings.push(bookingData);
    await user.save();

    res.status(201).json({
      message: "Booking added successfully",
      booking: user.bookings[user.bookings.length - 1],
    });
  } catch (err) {
    // console.error('Error adding booking:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all bookings
router.get("/all/bookings", async (req, res) => {
  try {
    const users = await User.find({}, "bookings");
    const allBookings = users.flatMap((user) => user.bookings || []);
    res.status(200).json({ bookings: allBookings });
  } catch (err) {
    // console.error('Error fetching all user bookings:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user bookings
router.get("/bookings/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ bookings: user.bookings, username: user.name });
  } catch (err) {
    // console.error('Error fetching bookings:', err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get customer bookings
router.get("/customer/bookings/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json([
      {
        name: user.name,
        bookings: user.bookings,
      },
    ]);
  } catch (error) {
    // console.error('Error fetching customer bookings:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get service provider bookings
router.get("/sp/bookings/:email", async (req, res) => {
  try {
    const users = await User.find({}, "name email bookings");
    const bookings = users.flatMap((user) =>
      user.bookings
        .filter((booking) => booking.parlorEmail === req.params.email)
        .map((booking) => ({
          _id: booking._id,
          transactionId: booking.transactionId,
          customerName: user.name,
          customerEmail: user.email,
          service: booking.service,
          favoriteEmployee: booking.favoriteEmployee,
          paymentStatus: booking.paymentStatus,
          amount: booking.amount,
          total_amount: booking.total_amount,
          date: booking.date,
          time: booking.time,
          createdAt: booking.createdAt,
          orderId: booking.orderId,
          refundedAmount: booking.refundedAmount,
          upiId: booking.upiId,
          refundStatus: booking.refundStatus,
          confirmed: booking.confirmed,
          spComplaint: booking.spComplaint,
          pin: booking.pin,
        }))
    );
    res.json(bookings);
  } catch (error) {
    // console.error('Error fetching SP bookings:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get role by email
router.get("/role/:email", async (req, res) => {
  try {
    const user = await Shop.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ role: user.designation });
  } catch (error) {
    // console.error('Error fetching role:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all services
router.get("/cards/services", async (req, res) => {
  try {
    const shops = await Shop.find({ approvals: true })
      .select(
        "shopName shopImage location services designation spRating countPeople priority email "
      )
      .lean();

    const services = shops.flatMap(
      (shop) =>
        shop.services?.map((service) => ({
          shopName: shop.shopName,
          shopImage: service.shopImage,
          location: shop.location,
          serviceName: service.serviceName,
          style: service.style,
          price: service.price,
          email: shop.email,
          serviceId: service._id,
          designation: shop.designation,
          countPeople: shop.countPeople || 0,
          spRating: shop.spRating || 0,
          priority: shop.priority || 0,
        })) || []
    );
    // console.log(services);
    res.status(200).json(services);
  } catch (error) {
    // console.error("Error fetching services:", error);
    res.status(500).json({ message: "Error fetching services" });
  }
});

router.get("/shop/by-service/:serviceId", async (req, res) => {
  const { serviceId } = req.params;

  try {
    // Find the shop containing the service
    const shop = await Shop.findOne({ "services._id": serviceId });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Clone shop object and exclude the specific service
    const shopObj = shop.toObject();
    shopObj.services = shopObj.services.filter(
      (service) => service._id.toString() !== serviceId
    );

    res.status(200).json(shopObj);
  } catch (error) {
    console.error("Error fetching shop by service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users for admin
router.get("/get/all/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email phone gender dob createdAt");
    res.status(200).json(users);
  } catch (err) {
    // console.error('Error fetching users:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    // console.error('Error deleting user:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update booking rating
router.post("/update/booking/rating", async (req, res) => {
  try {
    const { email, orderId, userRating, userReview } = req.body;

    const user = await User.findOneAndUpdate(
      { email, "bookings.orderId": orderId },
      {
        $set: {
          "bookings.$.userRating": userRating,
          "bookings.$.userReview": userReview,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User or Booking not found" });
    }

    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    // console.error('Error updating booking rating:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update booking confirmation
router.put("/update-confirmation", async (req, res) => {
  const { email, bookingId } = req.body;

  try {
    const user = await User.findOne({
      "bookings._id": bookingId,
      "bookings.parlorEmail": email,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //find that booking
    const booking = user.bookings.find(
      (booking) => booking._id.toString() === bookingId
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.confirmed = "Confirmed";
    user.save();
  } catch (error) {
    // console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }

  try {
    const user = await User.findOneAndUpdate(
      {
        "bookings._id": bookingId,
        "bookings.parlorEmail": email,
      },
      {
        $set: { "bookings.$.confirmed": "Confirmed" },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "Booking not found or PIN verification failed" });
    }

    res
      .status(200)
      .json({ message: "Booking confirmation updated successfully" });
  } catch (error) {
    // console.error("Error updating booking confirmation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

    
// Submit service provider complaint
router.post("/submit-complaint", async (req, res) => {
  const { email, bookingId, complaint } = req.body;

  try {
    if (!email || !bookingId || !complaint || complaint.trim() === "") {
      return res
        .status(400)
        .json({ message: "Email, bookingId, and complaint are required" });
    }

    const user = await User.findOneAndUpdate(
      { "bookings._id": bookingId, "bookings.parlorEmail": email },
      { $set: { "bookings.$.spComplaint": complaint } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    // console.error('Error submitting complaint:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user complaint
router.post("/update/booking/complaint", async (req, res) => {
  try {
    const { email, orderId, userComplaint } = req.body;

    const user = await User.findOneAndUpdate(
      { email, "bookings.orderId": orderId },
      { $set: { "bookings.$.userComplaint": userComplaint } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User or Booking not found" });
    }

    res.status(200).json({ message: "Complaint updated successfully" });
  } catch (error) {
    // console.error('Error updating booking complaint:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all complaints
router.get("/get/all/complaints", async (req, res) => {
  try {
    const users = await User.find({}, "name email bookings");
    const userComplaints = [];
    const spComplaints = [];

    users.forEach((user) => {
      user.bookings.forEach((booking) => {
        if (booking.userComplaint) {
          userComplaints.push({
            parlorName: booking.parlorName,
            parlorEmail: booking.parlorEmail,
            userName: user.name,
            email: user.email,
            complaint: booking.userComplaint,
            date: booking.date,
            service: booking.service,
          });
        }
        if (booking.spComplaint) {
          spComplaints.push({
            userEmail: user.email,
            spName: booking.parlorName,
            email: booking.parlorEmail,
            complaint: booking.spComplaint,
            date: booking.date,
            service: booking.service,
          });
        }
      });
    });

    res.json({ userComplaints, spComplaints });
  } catch (error) {
    // console.error('Error fetching complaints:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Collect payment
router.post("/collect/payment", async (req, res) => {
  try {
    const { bookingId, paymentAmount } = req.body;

    const user = await User.findOneAndUpdate(
      { "bookings._id": bookingId },
      {
        $inc: { "bookings.$.amount": paymentAmount },
        $set: {
          "bookings.$.paymentStatus": paymentAmount >= 0 ? "PAID" : "PENDING",
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User or Booking not found" });
    }

    const updatedBooking = user.bookings.find(
      (booking) => booking._id.toString() === bookingId
    );

    res.status(200).json({
      message: "Payment updated successfully",
      updatedAmount: updatedBooking.amount,
      paymentStatus: updatedBooking.paymentStatus,
    });
  } catch (error) {
    // console.error('Error updating payment:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel booking
router.post("/cancel/booking", async (req, res) => {
  const { email, orderId, upiId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const booking = user.bookings.find((b) => b.orderId === orderId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.confirmed === "Cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    if (new Date(booking.date) <= new Date()) {
      return res.status(400).json({ message: "Cannot cancel past bookings" });
    }

    let refundAmount = 0;
    const isFullPayment = booking.amount === booking.total_amount;

    if (isFullPayment) {
      if (!upiId) {
        return res
          .status(400)
          .json({ message: "UPI ID is required for full payment refunds" });
      }
      refundAmount = booking.amount * 0.75; // 25% deduction
      booking.upiId = upiId;
      booking.refundStatus = "PENDING";
      // console.log(`Initiating refund of ${refundAmount} to UPI ID: ${upiId}`);
    } else {
      refundAmount = 0;
      booking.refundStatus = "NONE";
    }

    booking.paymentStatus = "CANCELLED";
    booking.confirmed = "Cancelled";
    booking.refundedAmount = refundAmount;
    // booking.time = "";

    await user.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      refundAmount,
      upiId: isFullPayment ? upiId : null,
    });
  } catch (error) {
    // console.error('Error cancelling booking:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Handle refund action (accept/reject)
router.post("/sp/refund/action", async (req, res) => {
  const { email, orderId, action } = req.body;

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  try {
    const user = await User.findOne({ "bookings.orderId": orderId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const booking = user.bookings.find((b) => b.orderId === orderId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.parlorEmail !== email) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You do not own this booking" });
    }

    if (booking.paymentStatus !== "CANCELLED" || booking.refundedAmount === 0) {
      return res.status(400).json({ message: "No refund to process" });
    }

    if (booking.refundStatus !== "PENDING") {
      return res.status(400).json({ message: "Refund already processed" });
    }

    booking.refundStatus = action === "accept" ? "APPROVED" : "REJECTED";

    if (action === "accept") {
      booking.date = null;
      // console.log(
      //   `Processing refund of ${booking.refundedAmount} to UPI ID: ${booking.upiId}`
      // );
      // Integrate with payment gateway here (e.g., Razorpay, Paytm)
    }

    await user.save();
    res.status(200).json({ message: `Refund ${action}ed successfully` });
  } catch (error) {
    // console.error('Error processing refund action:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to update spRating
const updateSpRating = async (parlorEmail) => {
  try {
    const ratingsResult = await User.aggregate([
      { $unwind: "$bookings" },
      {
        $match: {
          "bookings.parlorEmail": parlorEmail,
          "bookings.userRating": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          ratings: { $push: "$bookings.userRating" },
          averageRating: { $avg: "$bookings.userRating" },
          countPeople: { $sum: 1 },
        },
      },
    ]);

    let averageRating = 0;
    let countPeople = 0;
    if (ratingsResult.length > 0) {
      averageRating = ratingsResult[0].averageRating || 0;
      countPeople = ratingsResult[0].countPeople || 0;
    }

    averageRating = Math.round(averageRating * 100) / 100;

    await Shop.updateOne(
      { email: parlorEmail },
      { $set: { spRating: averageRating, countPeople } }
    );

    return { parlorEmail, averageRating, countPeople };
  } catch (error) {
    // console.error(`Error updating spRating for ${parlorEmail}:`, error);
    return { parlorEmail, error: "Failed to update spRating" };
  }
};

// Get user ratings
router.get("/get/userRatings", async (req, res) => {
  try {
    const ratingsByParlor = await User.aggregate([
      { $unwind: "$bookings" },
      { $match: { "bookings.userRating": { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$bookings.parlorEmail",
          ratings: { $push: "$bookings.userRating" },
        },
      },
      {
        $project: {
          parlorEmail: "$_id",
          ratings: 1,
          _id: 0,
        },
      },
    ]);

    const segregatedRatings = ratingsByParlor.reduce(
      (acc, { parlorEmail, ratings }) => {
        acc[parlorEmail] = ratings;
        return acc;
      },
      {}
    );

    const autoUpdate = req.query.autoUpdate === "true";
    let updateResults = [];
    if (autoUpdate) {
      const updatePromises = ratingsByParlor.map(({ parlorEmail }) =>
        updateSpRating(parlorEmail)
      );
      updateResults = await Promise.all(updatePromises);
    }

    res.status(200).json({
      ratings: segregatedRatings,
      updatedRatings: autoUpdate ? updateResults : undefined,
    });
  } catch (error) {
    // console.error('Error fetching user ratings:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update spRating
router.post("/update/spRating", async (req, res) => {
  try {
    const { parlorEmail } = req.body;

    if (!parlorEmail) {
      return res.status(400).json({ message: "parlorEmail is required" });
    }

    const salon = await Shop.findOne({ email: parlorEmail });
    if (!salon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    const result = await updateSpRating(parlorEmail);

    if (result.error) {
      return res.status(500).json({ message: result.error });
    }

    const ratingsResult = await User.aggregate([
      { $unwind: "$bookings" },
      {
        $match: {
          "bookings.parlorEmail": parlorEmail,
          "bookings.userRating": { $exists: true, $ne: null },
        },
      },
      { $group: { _id: null, ratings: { $push: "$bookings.userRating" } } },
    ]);

    const ratings = ratingsResult.length > 0 ? ratingsResult[0].ratings : [];

    res.status(200).json({
      message: "spRating updated successfully",
      parlorEmail,
      ratings,
      averageRating: result.averageRating,
      countPeople: result.countPeople,
    });
  } catch (error) {
    // console.error('Error updating spRating:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Placeholder for admin dashboard route (if needed)
router.get("/admin/all/admins/data", async (req, res) => {
  try {
    res.json([]); // Return empty array as per previous implementation
  } catch (error) {
    // console.error('Error fetching admin data:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot Password ------------------------------------------------

// Nodemailer configuration
const mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "bongusaicustq11@gmail.com",
    pass: "hnvb huyg egke hqjr",
  },
});

// Forgot Password - Send OTP
router.post("/ForgotPassword/SendOTP", async (req, res) => {
  const { email, OTP, designation } = req.body;

  if (!email || !OTP || !designation) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and designation are required" });
  }

  try {
    let user;
    if (designation === "User") {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    } else if (designation === "Shop") {
      user = await Shop.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Shop not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid designation" });
    }

    // Store OTP and timestamp
    user.otp = OTP;
    user.otpTimestamp = new Date();
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: "bongusaicustq11@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${OTP}. It is valid for 5 minutes.`,
    };

    await mailTransporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    // console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get OTP for verification
router.post("/get/otp", async (req, res) => {
  const { email, designation } = req.body;

  if (!email || !designation) {
    return res
      .status(400)
      .json({ message: "Email and designation are required" });
  }

  try {
    let user;
    if (designation === "User") {
      user = await User.findOne({ email });
    } else if (designation === "Shop") {
      user = await Shop.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid designation" });
    }

    if (!user) {
      return res.status(404).json({ message: `${designation} not found` });
    }

    if (!user.otp || !user.otpTimestamp) {
      return res.status(400).json({ message: "No OTP found" });
    }

    // Check if OTP is expired (5 minutes = 300,000 ms)
    const currentTime = new Date();
    const otpTime = new Date(user.otpTimestamp);
    const timeDiff = currentTime - otpTime;

    if (timeDiff > 300000) {
      user.otp = null;
      user.otpTimestamp = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired" });
    }

    res.status(200).json({ otp: user.otp });
  } catch (error) {
    // console.error("Error fetching OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Password
router.put("/update/password", async (req, res) => {
  const { email, designation, password } = req.body;

  if (!email || !designation || !password) {
    return res
      .status(400)
      .json({ message: "Email, designation, and password are required" });
  }

  try {
    let user;
    if (designation === "User") {
      user = await User.findOne({ email });
    } else if (designation === "Shop") {
      user = await Shop.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid designation" });
    }

    if (!user) {
      return res.status(404).json({ message: `${designation} not found` });
    }

    // Update password
    user.password = password; // Password will be hashed by the schema's pre-save hook
    user.otp = null; // Clear OTP
    user.otpTimestamp = null;
    await user.save();

    // Send confirmation email
    const mailOptions = {
      from: "bongusaicustq11@gmail.com",
      to: email,
      subject: "Password Updated Successfully",
      text: "Your password has been updated successfully. If you did not initiate this change, please contact support immediately.",
    };

    await mailTransporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    // console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Create a new enquiry
router.post("/enquiries", async (req, res) => {
  try {
    const { email, parlorEmail, message } = req.body;

    // Validate input
    if (!email || !parlorEmail || !message) {
      return res
        .status(400)
        .json({ message: "Email, parlor email, and message are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create new enquiry
    const newEnquiry = {
      parlorEmail,
      email, // User's email
      userMessage: message,
    };

    // Add enquiry to user's enquiries array
    user.enquiries.push(newEnquiry);
    await user.save();

    res.status(201).json({ message: "Enquiry created successfully." });
  } catch (error) {
    // console.error("Error creating enquiry:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Get all enquiries for a specific parlorEmail SP
router.get("/enquiries/:parlorEmail", async (req, res) => {
  try {
    const { parlorEmail } = req.params;

    // Find users with enquiries matching the parlorEmail
    const users = await User.find(
      { "enquiries.parlorEmail": parlorEmail },
      { enquiries: 1, name: 1, email: 1, phone: 1 } // Project only necessary fields
    ).lean();

    // Flatten and format the enquiries
    const enquiries = users.flatMap((user) =>
      user.enquiries
        .filter((enquiry) => enquiry.parlorEmail === parlorEmail)
        .map((enquiry) => ({
          id: enquiry._id.toString(),
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: user.phone,
          message: enquiry.userMessage,
          salonEmail: parlorEmail,
          shopName: enquiry.parlorEmail, // Or fetch shopName from SalonShop model
          dateSubmitted: enquiry.createdAt,
          status: enquiry.status, // Convert to lowercase to match frontend
        }))
    );

    res.status(200).json(enquiries);
  } catch (error) {
    // console.error("Error fetching enquiries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update enquiry status or add spMessage SP
router.put("/enquiries/:enquiryId", async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const { status, spMessage } = req.body;

    // Find the user containing the enquiry
    const user = await User.findOneAndUpdate(
      { "enquiries._id": enquiryId },
      {
        $set: {
          "enquiries.$.status": status || "new",
          "enquiries.$.spMessage": spMessage || "",
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({ message: "Enquiry updated successfully" });
  } catch (error) {
    // console.error("Error updating enquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an enquiry SP
router.delete("/enquiries/:enquiryId", async (req, res) => {
  try {
    const { enquiryId } = req.params;

    // console.log(enquiryId);

    // Find the user and pull the enquiry
    const user = await User.findOneAndUpdate(
      { "enquiries._id": enquiryId },
      { $pull: { enquiries: { _id: enquiryId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    // console.error("Error deleting enquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET user enquiries by email ----> USer
router.get("/userEnquiries", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("enquiries");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedEnquiries = await Promise.all(
      user.enquiries.map(async (enquiry) => {
        const shop = await Shop.findOne({ email: enquiry.parlorEmail }).select(
          "shopName"
        );
        return {
          id: enquiry._id.toString(),
          serviceRequested: enquiry.userMessage || "N/A",
          shopName: shop ? shop.shopName : "N/A",
          shopEmail: enquiry.parlorEmail,

          dateSubmitted: enquiry.createdAt,
          status: enquiry.status,
          spMessage: enquiry.spMessage || "N/A",
        };
      })
    );

    res.json(formattedEnquiries);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//userProfile
router.get("/userProfile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    // const user = await User.findOne({ email });
    const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile

// routes/users.js or wherever your routes are defined
router.put("/updateProfile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent changing these fields
    delete updateData.designation;
    delete updateData.createdAt;

    // Update user fields (password will be hashed by pre-save middleware if modified)
    Object.assign(user, updateData);
    await user.save();

    // Return user data without the hashed password
    const { password, ...userData } = user.toObject();
    res.json({ message: "Profile updated successfully", user: userData });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
