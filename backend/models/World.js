// backend/models/World.js
const worldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  calendar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Calendar',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('World', worldSchema);