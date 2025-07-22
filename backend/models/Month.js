// backend/models/Month.js
const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  order: {
    type: Number,
    default: null,
  },
});

monthSchema.index({ calendar: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Month', monthSchema);