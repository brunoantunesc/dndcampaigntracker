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
  calendar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Calendar',
    required: true,
  },
});

module.exports = mongoose.model('Month', monthSchema);