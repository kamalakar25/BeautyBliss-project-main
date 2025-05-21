const express = require("express");
const router = express.Router();
const Shop = require("../models/SpSchema");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

// Serve static files from the 'uploads' folder (case-sensitive)
router.use(
  "/uploads",
  cors(),
  express.static(path.join(__dirname, "../uploads"))
);

// POST /api/salons - Create a new salon shop
router.post("/register-admin", async (req, res) => {
  try {
    const { phone, email, manPower } = req.body;

    // Check for existing phone/email for the salon itself
    const existingSalon = await Shop.findOne({ $or: [{ phone }, { email }] });
    if (existingSalon) {
      return res.status(400).json({ error: "Phone or Email already exists" });
    }

    // Check for duplicate manPower phones in the database
    const submittedPhones = manPower.map((m) => m.phone);
    const duplicatePhones = await Shop.findOne({
      "manPower.phone": { $in: submittedPhones },
    });

    if (duplicatePhones) {
      return res
        .status(400)
        .json({ error: "One or more manPower phone numbers already exist" });
    }

    // Check for duplicates in submitted manPower list itself
    const hasInternalDuplicates = submittedPhones.some(
      (phone, idx) => submittedPhones.indexOf(phone) !== idx
    );

    if (hasInternalDuplicates) {
      return res
        .status(400)
        .json({ error: "Duplicate manPower phone numbers in your submission" });
    }

    // Save the salon
    const newSalon = new Shop(req.body);
    await newSalon.save();

    res.status(201).json({
      message: "Created successfully",
      salon: newSalon,
    });
  } catch (err) {
    // console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// POST /add-manpower
router.post("/add-manpower/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { name, phone, experience, salary } = req.body;

    const shop = await Shop.findOne({ email: email });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.manPower.push({ name, phone, experience, salary });

    await shop.save();

    res.status(200).json({ message: "Manpower added", shop });
  } catch (error) {
    res.status(500).json({ message: "Error adding manpower", error });
  }
});

// Route to fetch employees by email
router.get("/get-manpower/:email", async (req, res) => {
  const { email } = req.params; // Extract email from URL params

  try {
    // Find the salon shop by email and populate the manPower field
    const ShopDetails = await Shop.findOne({ email }).select("manPower");

    if (!ShopDetails) {
      return res.status(404).json({ message: " Shop details not found" });
    }

    // Send back the manpower (employees) data
    res.json(ShopDetails.manPower);
  } catch (error) {
    // console.error('Error fetching manpower:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Example Node.js/Express API route for updating an employee
router.put("/update-manpower/:id", async (req, res) => {
  try {
    const { name, phone, salary, experience } = req.body;
    const manpowerId = req.params.id;

    // Find the shop that contains this manpower ID
    const shop = await Shop.findOne({ "manPower._id": manpowerId });

    if (!shop) {
      return res
        .status(404)
        .json({ message: "Shop with this manpower not found" });
    }

    // Find the specific manpower entry and update it
    const employee = shop.manPower.id(manpowerId);
    if (!employee) {
      return res.status(404).json({ message: "Manpower entry not found" });
    }

    employee.name = name;
    employee.phone = phone;
    employee.salary = salary;
    employee.experience = experience;

    await shop.save();

    res
      .status(200)
      .json({ message: "Manpower updated successfully", employee });
  } catch (error) {
    // console.error('Error updating manpower:', error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Backend code to handle deleting manpower (employee)
router.delete("/delete-manpower/:id", async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters

  try {
    // Find the salon shop by its ID and remove the employee from the manPower array
    const shop = await Shop.findOneAndUpdate(
      { "manPower._id": id }, // Find the shop where the employee exists in the manPower array
      { $pull: { manPower: { _id: id } } }, // Remove the employee from the manPower array
      { new: true } // Return the updated shop document
    );

    if (!shop) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    // console.error('Error deleting employee:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all services
router.get("/get-services/:email", async (req, res) => {
  try {
    const adShop = await Shop.findOne({ email: req.params.email });

    if (!adShop) {
      return res.status(404).json({ msg: "Shop not found" });
    }
    res.json(adShop.services);
  } catch (err) {
    // console.error(err); // To log any error to the console for debugging
    res.status(500).send("Server error");
  }
});

// Setup multer
const storage = multer.diskStorage({
  destination: "uploads/", // Ensure folder exists in production
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// POST route to add a service
router.post(
  "/add-service/:email",
  upload.single("shopImage"),
  async (req, res) => {
    try {
      const email = req.params.email;
      const { serviceName, style, price, duration } = req.body;

      // Validation
      if (!serviceName) {
        return res.status(400).json({ message: "Service name is required" });
      }
      if (!price || isNaN(price) || parseFloat(price) <= 0) {
        return res.status(400).json({ message: "Price must be a positive number" });
      }
      if (!duration || isNaN(duration) || parseInt(duration) < 20) {
        return res.status(400).json({ message: "Duration must be at least 20 minutes" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      const shop = await Shop.findOne({ email });

      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      // Normalize path to use forward slashes
      const shopImagePath = req.file.path.replace(/\\/g, "/");

      shop.services.push({
        serviceName,
        style,
        price: parseFloat(price),
        duration: parseInt(duration), // Store as integer
        shopImage: shopImagePath,
      });

      await shop.save();

      res.status(200).json({
        message: "Service added successfully",
        services: shop.services,
        parlorName: shop.name, // Include parlorName for notifications
      });
    } catch (error) {
      console.error('Error adding service:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// PUT route to update service by ID
router.put(
  "/update-service/:serviceId",
  upload.single("shopImage"),
  async (req, res) => {
    const { serviceId } = req.params;
    const { serviceName, price, style, duration } = req.body;

    try {
      // Validation
      if (!serviceName) {
        return res.status(400).json({ message: "Service name is required" });
      }
      if (!price || isNaN(price) || parseFloat(price) <= 0) {
        return res.status(400).json({ message: "Price must be a positive number" });
      }
      if (!duration || isNaN(duration) || parseInt(duration) < 20) {
        return res.status(400).json({ message: "Duration must be at least 20 minutes" });
      }

      const AdminSalon = await Shop.findOne({ "services._id": serviceId });
      if (!AdminSalon) {
        return res.status(404).json({ message: "Service not found" });
      }

      const service = AdminSalon.services.id(serviceId);
      if (!service) {
        return res
          .status(404)
          .json({ message: "Service not found in document" });
      }

      // Update fields
      service.serviceName = serviceName;
      service.style = style || ""; // Allow empty style
      service.price = parseFloat(price);
      service.duration = parseInt(duration); // Update duration

      if (req.file) {
        // Delete old image if it exists
        if (service.shopImage && fs.existsSync(service.shopImage)) {
          fs.unlinkSync(service.shopImage);
        }
        // Normalize new path to use forward slashes
        service.shopImage = req.file.path.replace(/\\/g, "/");
      }

      await AdminSalon.save();
      res.status(200).json({
        message: "Service updated successfully",
        updatedService: service,
        parlorName: AdminSalon.name, // Include parlorName for notifications
      });
    } catch (error) {
      console.error('Update Error:', error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
);

// Delete a service
router.delete("/deleteService/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const shop = await Shop.findOne({ "services._id": id });
    if (!shop) {
      return res.status(404).json({ message: "Service not found" });
    }

    const service = shop.services.id(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Delete the image file if it exists
    if (service.shopImage && fs.existsSync(service.shopImage)) {
      fs.unlinkSync(service.shopImage);
    }

    // Remove the service
    shop.services.pull({ _id: id });
    await shop.save();

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    // console.error('Error deleting service:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all services cards
router.get("/cards/services", async (req, res) => {
  try {
    const shops = await Shop.find({}, "services shopName location"); // fetch needed fields

    const filteredServices = shops.flatMap((shop) =>
      shop.services.map((service) => ({
        shopName: shop.shopName,
        serviceName: service.serviceName,
        price: service.price,
        rating: service.rating,
        shopImage: service.shopImage,
        location: shop.location,
      }))
    );

    res.status(200).json(filteredServices);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Check if there are employees
router.get("/check-employees/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const hasEmployees = shop.manPower && shop.manPower.length > 0;
    // console.log('Has employees:', hasEmployees);

    res.json({ hasEmployees });
  } catch (error) {
    // console.error('Error checking employees:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get full data of all salon shops (including services, manPower, etc.)
router.get("/all/admins/data", async (req, res) => {
  try {
    const allShops = await Shop.find(); // fetches everything
    res.status(200).json(allShops); // send full shop data
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /parlor/:email
router.get("/parlor/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const parlor = await Shop.findOne({ email }).lean();
    if (!parlor) {
      return res.status(404).json({ message: "Parlor not found" });
    }
    res.json(parlor);
  } catch (error) {
    console.error("Error fetching parlor:", error);
    res.status(500).json({ message: "Server error" });
  }
});


//userProfile
router.get("/SpProfile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    // const user = await User.findOne({ email });
    const serviceProvider = await Shop.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!serviceProvider) {
      return res.status(404).json({ message: "serviceProvider not found" });
    }
    res.json(serviceProvider);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// UPDATE Service Provider Profile
router.put('/updateSpProfile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    const serviceProvider = await Shop.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service Provider not found' });
    }

    // Prevent changing designation and spRating
    delete updateData.designation;
    delete updateData.spRating;

    // Update availableTime if provided
    if (updateData.availableTime) {
      serviceProvider.availableTime = {
        fromTime: updateData.availableTime.fromTime || serviceProvider.availableTime.fromTime,
        toTime: updateData.availableTime.toTime || serviceProvider.availableTime.toTime,
      };
      delete updateData.availableTime; // Remove from updateData to avoid direct assignment
    }

    // Update coordinates if location is provided
    if (updateData.location) {
      const [lat, lon] = updateData.location
        .replace('Lat: ', '')
        .replace('Lon: ', '')
        .split(', ')
        .map((coord) => parseFloat(coord));
      serviceProvider.coordinates = {
        latitude: lat,
        longitude: lon,
      };
    }

    // Assign other fields (password will be hashed by pre-save middleware if modified)
    Object.assign(serviceProvider, updateData);
    await serviceProvider.save();

    // Return service provider data without the hashed password
    const { password, ...spData } = serviceProvider.toObject();
    res.json({ message: 'Profile updated successfully', serviceProvider: spData });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /parlor-by-name
router.get("/parlor-by-name", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Parlor name is required" });
    }
    const parlor = await Shop.findOne({ name });
    if (!parlor) {
      return res.status(404).json({ message: "Parlor not found" });
    }
    res.json({ email: parlor.email });
  } catch (error) {
    console.error("Error fetching parlor by name:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
