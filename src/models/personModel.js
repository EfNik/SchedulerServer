const db = require('../database/db');

// Get all people
exports.getAllPeople = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM people', (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows || []); // Ensure rows is always an array
    });
  });
};

// Insert or update a person
exports.upsertPerson = (person) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO people (id, name, team) 
       VALUES (?, ?, ?)`,
      [person.id, person.name, person.team],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};
