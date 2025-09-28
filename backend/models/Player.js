const db = require('../config/db');

const Player = {
  getAll: () => db.query('SELECT * FROM Player'),
  create: (data) => db.query(
    `INSERT INTO Player ( TeamId, name, number, birthyear)
    VALUES (?,?,?,?)`,
    [data.TeamId, data.name, data.number, data.birthyear]
  ),

  update: (PlayerId, data) => db.query(
    'UPDATE Player SET TeamId = ?, name = ?, number = ?, birthyear = ?  WHERE PlayerId = ?',
    [data.TeamId, data.name, data.number, data.birthyear, PlayerId]
  ),
  delete: (PlayerId) => db.query('DELETE FROM Player WHERE PlayerId = ?', [PlayerId]),
};

module.exports = Player;
