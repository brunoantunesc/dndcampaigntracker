// backend/models/Campaign.js
const mongoose = require('mongoose');

const arcSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  title: {
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