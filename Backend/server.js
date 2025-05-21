require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/SpRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/PaymentGateway');
const Payment = require('./models/payment');
const Razorpay = require('./routes/RazorPay');
const Terms = require('./routes/TermsRoute');
const notificationRoutes = require('./routes/notifications'); // Adjust path

const Slot = require('./routes/slots');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', shopRoutes);
app.use('/api/main/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/razorpay', Razorpay);
app.use('/api/terms' , Terms);
app.use('/api/notifications', notificationRoutes);

app.use('/api/slots', Slot);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
