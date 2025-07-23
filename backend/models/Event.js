// backend/models/Session.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  }
  inGameDate: {
    type: String,
    required: true,
  },
  world: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'World',
    required: true,
  },
});

module.exports = mongoose.model('Event', eventSchema);