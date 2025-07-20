// backend/models/Character.js
const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  race: {
    type: String,
    required: true,
  },
  characterClass: {
    type: String,
    required: true,
  },
  subclass: {
    type: String,
  },
  birthDate: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Character', characterSchema);