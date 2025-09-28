const Player = require('../models/Player');

exports.getAllPlayers = async (req, res) => {
  try {
    const [rows] = await Player.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPlayer = async (req, res) => {
  try {
    const { TeamId, name, number, birthyear } = req.body;
    const [result] = await Player.create({ TeamId, name, number, birthyear });

    res.status(201).json({ message: 'Player created', PlayerId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { TeamId, name, number, birthyear } = req.body;

    await Player.update(id, { TeamId, name, number, birthyear });
    res.json({ message: 'Player updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    await Player.delete(id);
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
