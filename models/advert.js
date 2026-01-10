const mongoose = require('mongoose');
const AdvertSchema = new mongoose.Schema({
  email: { type: String, required: true },
  language: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});
module.exports = mongoose.model('Advert', AdvertSchema);
