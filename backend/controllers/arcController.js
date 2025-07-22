const Arc = require('../models/Arc');

exports.createArc = async (req, res) => {
  try {
    const arc = await Arc.create({ ...req.body, owner: req.user.id });
    res.status(201).json(arc);
  } catch (err) {
    res.status(400).json({ message: 'Error creating arc', error: err.message });
  }
};

exports.getArcs = async (req, res) => {
  try {
    const arcs = await Arc.find().populate('campaign').populate('sessions');
    res.json(arcs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching arcs', error: err.message });
  }
};

exports.getArcById = async (req, res) => {
  try {
    const arc = await Arc.findById(req.params.id)
      .populate('campaign').populate('sessions')
    if (!arc) {
      return res.status(404).json({ message: 'Arc not found' });
    }
    res.json(arc);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching arc', error: err.message });
  }
};

exports.updateArc = async (req, res) => {
  try {
    const updated = await Arc.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Arc not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating arc', error: err.message });
  }
};

exports.deleteArc = async (req, res) => {
  try {
    const deleted = await Arc.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Arc not found' });
    res.json({ message: 'Arc deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting arc', error: err.message });
  }
};
