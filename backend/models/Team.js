const db = require('../config/db');

const Team = {
  getAll: () => db.query('SELECT * FROM Team'),
  create: (data) => db.query(
    `INSERT INTO Team ( name )
    VALUES (?)`,
    [data.name]
  ),

  update: (TeamId, data) => db.query(
    'UPDATE Team SET name = ? WHERE TeamId = ?',
    [data.name, TeamId]
  ),
  delete: (TeamId) => db.query('DELETE FROM Team WHERE TeamId = ?', [TeamId]),
};

module.exports = Team;
