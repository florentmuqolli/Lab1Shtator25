const express = require('express');
const router = express.Router();
const playerController = require('../controllers/PlayerController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRoles('admin'), playerController.getAllPlayers);
router.post('/', authenticateToken, authorizeRoles('admin'), playerController.createPlayer);
router.put('/:id', authenticateToken, authorizeRoles('admin'), playerController.updatePlayer);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), playerController.deletePlayer);

module.exports = router;
