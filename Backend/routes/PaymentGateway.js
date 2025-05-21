const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/user');
const Payment = require('../models/payment');
const crypto = require('crypto'); // Added for webhook signature verification

// Cashfree configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_VERSION = '2022-01-01';
const CASHFREE_BASE_URL = process.env.CASHFREE_ENV === 'PRODUCTION'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

// Validate environment variables
if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
  // console.error('Cashfree credentials missing. Check CASHFREE_APP_ID and CASHFREE_SECRET_KEY in .env');
}

// Generate unique order ID
const generateOrderId = () => {
  return `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone format (10 digits)
const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

// Validate URL format
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Webhook signature verification
const verifyWebhookSignature = (body, signature, secretKey) => {
  const rawBody = JSON.stringify(body);
  const computedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(rawBody)
    .digest('base64');
  return computedSignature === signature;
};

// Create a Cashfree order
router.post('/create-order', async (req, res) => {
  const { bookingId, amount, customerName, customerEmail, customerPhone, returnUrl } = req.body;

  // Validate required fields
  if (!bookingId || !amount || !customerEmail || !customerPhone || !returnUrl) {
    // console.error('Invalid request payload:', req.body);
    return res.status(400).json({
      success: false,
      message: 'Booking ID, amount, customer email, customer phone, and return URL are required',
    });
  }

  // Validate email and phone formats
  if (!isValidEmail(customerEmail)) {
    // console.error('Invalid email format:', customerEmail);
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  if (!isValidPhone(customerPhone)) {
    // console.error('Invalid phone format:', customerPhone);
    return res.status(400).json({
      success: false,
      message: 'Phone number must be 10 digits',
    });
  }

  // Validate amount
  if (amount <= 0) {
    // console.error('Invalid amount:', amount);
    return res.status(400).json({
      success: false,
      message: 'Amount must be greater than 0',
    });
  }

  // Validate returnUrl
  if (!isValidUrl(returnUrl)) {
    // console.error('Invalid return URL:', returnUrl);
    return res.status(400).json({
      success: false,
      message: 'Invalid return URL format',
    });
  }

  // Validate environment variables
  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    return res.status(500).json({
      success: false,
      message: 'Server configuration error: Missing Cashfree credentials',
    });
  }

  try {
    const orderId = generateOrderId();
    const notifyUrl = process.env.WEBHOOK_URL || 'https://your-ngrok-id.ngrok.io/api/payments/webhook'; // Use .env for webhook URL
    // console.log('Creating order with payload:', { bookingId, amount, customerName, customerEmail, customerPhone, returnUrl, notifyUrl });

    // Validate notifyUrl
    if (!isValidUrl(notifyUrl)) {
      // console.error('Invalid notify URL:', notifyUrl);
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: Invalid notify URL',
      });
    }

    // Save payment record
    const payment = new Payment({
      bookingId,
      orderId,
      amount,
      paymentStatus: 'PENDING',
    });
    await payment.save();
    // console.log(`Payment record created: ${JSON.stringify(payment)}`);

    const headers = {
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
      'x-api-version': CASHFREE_API_VERSION,
      'Content-Type': 'application/json',
    };

    const cashfreePayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `cust_${bookingId}`,
        customer_name: customerName || 'Guest',
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: notifyUrl,
      },
    };

    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,
      cashfreePayload,
      { headers }
    );
    // console.log('Cashfree API response:', response.data);

    // Update booking with orderId
    await User.updateOne(
      { 'bookings._id': bookingId },
      {
        $set: {
          'bookings.$.orderId': orderId,
          'bookings.$.paymentStatus': 'PENDING',
        },
      }
    );
    // console.log(`Booking updated with orderId: ${orderId}`);

    res.json({
      success: true,
      paymentLink: response.data.payment_link,
      orderId,
    });
  } catch (error) {
    // console.error('Error creating Cashfree order:', {
    //   message: error.message,
    //   response: error.response?.data,
    //   status: error.response?.status,
    // });
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.response?.data || error.message,
    });
  }
});

// Webhook to handle payment status updates
router.post('/webhook', async (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  // console.log('Webhook received:', JSON.stringify(req.body, null, 2));
  // console.log('Webhook signature:', signature);

  const { order_id, order_status, cf_order_id, payment_status } = req.body.data?.order || {};

  if (!order_id || !cf_order_id) {
    // console.error('Webhook missing order_id or cf_order_id:', req.body);
    return res.status(400).json({
      success: false,
      message: 'Missing order_id or cf_order_id',
    });
  }

  // Verify webhook signature
  if (!verifyWebhookSignature(req.body, signature, CASHFREE_SECRET_KEY)) {
    // console.error('Invalid webhook signature for order:', order_id);
    return res.status(401).json({
      success: false,
      message: 'Invalid webhook signature',
    });
  }

  try {
    // Map Cashfree status to internal status
    let internalStatus;
    if (order_status === 'PAID' && payment_status === 'SUCCESS') {
      internalStatus = 'PAID';
    } else if (order_status === 'TERMINATED' || payment_status === 'FAILED') {
      internalStatus = 'FAILED';
    } else {
      internalStatus = 'PENDING';
    }

    // Use a transaction to ensure atomic updates
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Update Payment model
      const payment = await Payment.findOneAndUpdate(
        { orderId: order_id },
        {
          paymentStatus: internalStatus,
          transactionId: cf_order_id, // Use cf_order_id as transactionId
          updatedAt: new Date(),
        },
        { new: true, session }
      );

      if (!payment) {
        // console.error(`Payment record not found for order ${order_id}`);
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Payment record not found',
        });
      }

      // Update User booking
      const userUpdateResult = await User.updateOne(
        { 'bookings._id': payment.bookingId },
        {
          $set: {
            'bookings.$.paymentStatus': internalStatus,
            'bookings.$.transactionId': cf_order_id,
          },
        },
        { session }
      );

      if (userUpdateResult.modifiedCount === 0) {
        // console.error(`Booking not found for order ${order_id}, bookingId: ${payment.bookingId}`);
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Booking record not found',
        });
      }

      await session.commitTransaction();
      // console.log(`Payment and booking updated for order ${order_id}: ${internalStatus}, transactionId: ${cf_order_id}`);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    // console.error('Webhook error:', {
    //   message: error.message,
    //   response: error.response?.data,
    //   status: error.response?.status,
    // });
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;