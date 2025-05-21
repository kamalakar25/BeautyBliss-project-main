const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AddAdmin = new mongoose.Schema({
  Email: { type: String, required: true },
  Password: { type: String, required: true },
});

const manPowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
    default: undefined,
  },
  experience: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
});

const addServiceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  style: { type: String, required: true },
  price: { type: Number, required: true },
  shopImage: { type: String, required: true },
  duration: { type: Number, required: true, min: 20 },
});

const salonShopSchema = new mongoose.Schema(
  {
    approvals: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    spAddress: {
      type: String,
    },
    spRating: {
      type: Number,
      default: 0,
    },
    countPeople: {
      type: Number,
    },
    otp: { type: Number },
    otpTimestamp: { type: Date },
    manPower: [manPowerSchema],
    services: [addServiceSchema],
    availableTime: {
      fromTime: {
        type: String,
        required: true,
      },
      toTime: {
        type: String,
        required: true,
      },
    },
    priority: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash the password before saving it
salonShopSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Pre-save hook to ensure the dob is stored without the time part (time set to 00:00:00.000 UTC)
salonShopSchema.pre('save', function (next) {
  if (this.dob) {
    this.dob.setUTCHours(0, 0, 0, 0);
  }
  next();
});

const SalonShop = mongoose.model('shops', salonShopSchema);
module.exports = SalonShop;
