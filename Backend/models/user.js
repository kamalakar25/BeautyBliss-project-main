const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const bookingSchema = new mongoose.Schema({
  userComplaint: { type: String },
  spComplaint: { type: String },
  confirmed: { type: String, default: 'Pending' },
  pin: { type: String },
  parlorEmail: { type: String, required: true },
  parlorName: { type: String, required: true },
  name: { type: String },
  amount: { type: Number },
  userRating: { type: Number },
  userReview: { type: String },
  total_amount: { type: Number },
  Payment_Mode: { type: String },
  date: { type: Date },
  time: { type: String, required: true },
  service: { type: String, required: true },
  duration: { type: Number },
  favoriteEmployee: { type: String, required: true },
  relatedServices: [{ type: String }],
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'CANCELLED'],
    default: 'PENDING',
  },
  transactionId: { type: String },
  orderId: { type: String },
  createdAt: { type: Date, default: Date.now },
  failureReason: { type: String },
  refundedAmount: { type: Number, default: 0 },
  upiId: { type: String },
  refundStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'NONE'],
    default: 'NONE',
  },
});

const enquirySchema = new mongoose.Schema({
  parlorEmail: { type: String, required: true },
  email: { type: String, required: true },
  userMessage: { type: String },
  spMessage: { type: String, default: '' },
  status: { type: String, enum: ['new', 'all', 'approved'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    otp: { type: Number },
    otpTimestamp: { type: Date },
    login: { type: Boolean, default: false },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phone: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    designation: { type: String, required: true },
    password: { type: String, required: true },
    bookings: [bookingSchema],
    enquiries: [enquirySchema],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
