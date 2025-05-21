const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  answer: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'answered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const termsSchema = new mongoose.Schema({
  term: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

faqSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

termsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Faq = mongoose.model('Faq', faqSchema);
const Term = mongoose.model('Term', termsSchema);

module.exports = { Faq, Term };