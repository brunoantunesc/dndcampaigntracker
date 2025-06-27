// backend/models/Calendar.js
const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  months: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Month',
  }],
});

module.exports = mongoose.model('Calendar', calendarSchema);