const db = require('../database/db');

// Get all assignments
exports.getAllAssignments = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM assignments', (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows || []); // Ensure rows is always an array
    });
  });
};

// Insert or update an assignment
exports.upsertAssignment = (assignment) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO assignments (id, event, resource) 
       VALUES (?, ?, ?)`,
      [assignment['$PhantomId'], assignment.eventId, assignment.resourceId],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};