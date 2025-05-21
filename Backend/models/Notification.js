const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientEmail: { type: String, required: true }, // User or SP email
  recipientType: { type: String, enum: ['User', 'ServiceProvider'], required: true }, // User or SP
  type: { type: String, enum: ['Booking', 'NewService'], required: true }, // Notification type
  title: { type: String, required: true }, // e.g., "Booking Confirmed", "New Service Added"
  message: { type: String, required: true }, // Detailed message
  bookingId: { type: mongoose.Schema.Types.ObjectId, default: null }, // Reference to booking (if applicable)
  serviceId: { type: mongoose.Schema.Types.ObjectId, default: null }, // Reference to service (if applicable)
  userDetails: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
  }, // User details for SP notifications
  isRead: { type: Boolean, default: false }, // Read status
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;