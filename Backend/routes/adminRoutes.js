const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Shop = require("../models/SpSchema");
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");

// Admin dashboard route

// GET all users (including join date)
router.get("/get/all/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email phone gender dob ");
    res.status(200).json(users);
  } catch (err) {
    // console.error('Error fetching users:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    // console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all service providers
router.get("/get/all/service-providers", async (req, res) => {
  try {
    const shops = await Shop.find(
      { approvals: true },
      "name email phone gender dob shopName location designation spAddress createdAt spRating priority"
    ).lean();
    // console.log("Fetched shops:", shops.map((shop) => shop._id.toString()));
    res.status(200).json(shops);
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res.status(500).json({ message: "Error fetching service providers" });
  }
});

// Update priority of a service provider

router.put("/update-priority/:id", async (req, res) => {
  console.log("Update priority request:", {
    id: req.params.id,
    priority: req.body.priority,
  });
  try {
    const { priority } = req.body;
    if (priority === undefined || isNaN(priority) || priority < 0) {
      return res.status(400).json({ message: "Invalid priority value" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { priority: parseInt(priority) },
      { new: true }
    );
    if (!shop) {
      console.log(`Shop not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Shop not found" });
    }
    console.log("Shop updated:", shop);
    res.status(200).json({ message: "Priority updated successfully", shop });
  } catch (error) {
    console.error("Error updating priority:", error);
    res.status(500).json({ message: "Server error while updating priority" });
  }
});



// Delete a service provider by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Shop.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Service provider not found" });
    }
    res.status(200).json({ message: "Service provider deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service provider" });
  }
});

// GET pending approval service providers
router.get("/service-providers/pending", async (req, res) => {
  try {
    const pendingProviders = await Shop.find({ approvals: false }).select(
      "name email designation location phone shopName spAddress"
    );

    res.status(200).json(pendingProviders);
  } catch (error) {
    // console.error('Error fetching pending providers:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve the service provider
// router.post('/service-providers/approve/:id', async (req, res) => {
//     try {
//       const providerId = req.params.id;
//       const provider = await Shop.findByIdAndUpdate(
//         providerId,
//         { approvals: true },
//         { new: true }
//       );

//       if (!provider) {
//         return res.status(404).json({ message: 'Provider not found' });
//       }

//       res.status(200).json({ message: 'Provider approved', provider });
//     } catch (error) {
//       console.error('Error approving service provider:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });

router.post("/service-providers/approve/:id", async (req, res) => {
  try {
    const providerId = req.params.id;

    const provider = await Shop.findByIdAndUpdate(
      providerId,
      { approvals: true },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bharathmuntha27@gmail.com", // replace with your email
        pass: "rpho wwtl lcqe gopb", // use App Password (not your email password)
      },
    });

    const mailOptions = {
      from: "bharathmuntha27@gmail.com",
      to: provider.email, // make sure provider.email exists in your Shop model
      subject: "Service Provider Approval",
      html: `
        <h3>Hello ${provider.name},</h3>
        <p>Your service provider account has been approved! You can now log in and start offering your services on our platform.</p>
        <p>Thank you for joining us.</p>
        <br>
       
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Provider approved and email sent", provider });
  } catch (error) {
    // console.error('Error approving service provider:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject the service provider (reject and delete)

router.post("/service-providers/reject/:id", async (req, res) => {
  try {
    const providerId = req.params.id;

    const provider = await Shop.findByIdAndDelete(providerId);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Send rejection email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bharathmuntha27@gmail.com",
        pass: "rpho wwtl lcqe gopb", // App Password
      },
    });

    const mailOptions = {
      from: "bharathmuntha27@gmail.com",
      to: provider.email, // Ensure `email` field exists on the Shop model
      subject: "Service Provider Application Rejected",
      html: `
          <h3>Hello ${provider.name},</h3>
          <p>We're sorry to inform you that your service provider application has been rejected.</p>
          <p>If you have any questions or believe this was a mistake, please feel free to contact our support team.</p>
          <br>
          <p>Thank you for your interest.</p>
        `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Provider rejected and email sent" });
  } catch (error) {
    // console.error('Error rejecting service provider:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all revenue data
router.get("/revenue", async (req, res) => {
  try {
    const Users = await User.find();
    const Booking = Users.map((user) => user.bookings);
    res.json(Booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue data", error });
  }
});

module.exports = router;
