// backend/models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  hook: {
    type: String,
    required: true,
  },
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
  }],
  world: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'World',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Campaign', campaignSchema);