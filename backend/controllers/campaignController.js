// backend/controllers/campaignController.js
const Campaign = require('../models/Campaign');

exports.createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar campanha', error: err.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate('world').populate('arcs').populate('characters')
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar campanhas', error: err.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('world').populate('arcs').populate('characters')
    if (!campaign) {
      return res.status(404).json({ message: 'Campanha não encontrada' });
    }
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao buscar campanha', error: err.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Campanha não encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar campanha', error: err.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Campanha não encontrada' });
    res.json({ message: 'Campanha deletada com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao deletar campanha', error: err.message });
  }
};
