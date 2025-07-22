// backend/models/Campaign.js
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
});

module.exports = mongoose.model('Campaign', campaignSchema);