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
  endDate: {
    type: String,
  },
  arcs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Arc',
  }],
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
  }],
  world: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'World',
    required: true,
  },
});

module.exports = mongoose.model('Campaign', campaignSchema);