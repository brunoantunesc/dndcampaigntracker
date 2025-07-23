// backend/routes/campaignRoutes.js
const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, campaignController.createCampaign);
router.get('/', authenticateToken, campaignController.getCampaigns);
router.get('/:id', authenticateToken, campaignController.getCampaignById);
router.put('/:id', authenticateToken, campaignController.updateCampaign);
router.delete('/:id', authenticateToken, campaignController.deleteCampaign);

module.exports = router;