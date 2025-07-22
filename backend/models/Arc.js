// backend/models/Arc.js
const mongoose = require('mongoose');

const arcSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
  }],
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
  },
});

module.exports = mongoose.model('Arc', arcSchema);