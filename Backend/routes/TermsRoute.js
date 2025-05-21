
const express = require('express');
const router = express.Router();
const { Faq, Term } = require('../models/Terms');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const email = req.headers['user-email']; // Assume email is sent in headers from localStorage
  if (!email) {
    return res.status(401).json({ message: 'Please log in to post a question' });
  }
  req.userEmail = email;
  next();
};

// Get all FAQs with answers
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await Faq.find({ status: 'answered', answer: { $ne: '' } }).sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all pending FAQs (Admin only)
router.get('/pending-faqs', async (req, res) => {
  try {
    const faqs = await Faq.find({ status: 'pending', answer: '' }).sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a new FAQ question (Authenticated users)
router.post('/faqs', isAuthenticated, async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ message: 'Question is required' });
  }

  const faq = new Faq({
    question,
    email: req.userEmail,
  });

  try {
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update FAQ answer (Admin only)
router.put('/faqs/:id', async (req, res) => {
  const { answer } = req.body;
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    faq.answer = answer;
    faq.status = 'answered';
    await faq.save();
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all terms
router.get('/terms', async (req, res) => {
  try {
    const terms = await Term.find().sort({ createdAt: -1 });
    res.json(terms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new term (Admin only)
router.post('/terms', async (req, res) => {
  const { term } = req.body;
  if (!term) {
    return res.status(400).json({ message: 'Term is required' });
  }

  const newTerm = new Term({ term });
  try {
    await newTerm.save();
    res.status(201).json(newTerm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a term (Admin only)
router.put('/terms/:id', async (req, res) => {
  const { term } = req.body;
  try {
    const existingTerm = await Term.findById(req.params.id);
    if (!existingTerm) {
      return res.status(404).json({ message: 'Term not found' });
    }
    existingTerm.term = term;
    await existingTerm.save();
    res.json(existingTerm);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a term (Admin only)
router.delete('/terms/:id', isAuthenticated, async (req, res) => {
    try {
      const term = await Term.findByIdAndDelete(req.params.id);
      if (!term) {
        return res.status(404).json({ message: 'Term not found' });
      }
      res.json({ message: 'Term deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Delete an FAQ (Admin only)
router.delete('/faqs/:id', async (req, res) => {
    try {
      const faq = await Faq.findByIdAndDelete(req.params.id);
      if (!faq) {
        return res.status(404).json({ message: 'FAQ not found' });
      }
      res.json({ message: 'FAQ deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;