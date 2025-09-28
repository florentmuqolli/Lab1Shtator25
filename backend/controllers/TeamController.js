const Team = require('../models/Team');

exports.getAllTeams = async (req, res) => {
  try {
    const [rows] = await Team.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await Team.create({ name });
    res.status(201).json({ message: 'Team created', TeamId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await Team.update(id, { name });
    res.json({ message: 'Team updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    await Team.delete(id);
    res.json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
