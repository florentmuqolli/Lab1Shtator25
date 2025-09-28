const express = require('express');
const router = express.Router();
const teamController = require('../controllers/TeamController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRoles('admin'), teamController.getAllTeams);
router.post('/', authenticateToken, authorizeRoles('admin'), teamController.createTeam);
router.put('/:id', authenticateToken, authorizeRoles('admin'), teamController.updateTeam);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), teamController.deleteTeam);

module.exports = router;
