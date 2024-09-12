const db = require('../database/db');

// Get all tasks
exports.getAllTasks = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows || []); // Ensure rows is always an array
    });
  });
};

// Insert or update a task
exports.upsertTask = (task) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO tasks (id, name, startDate, endDate, percentDone, note) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [task['$PhantomId'], task.name, task.startDate, task.endDate, task.percentDone, task.note],
      function (err) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};

exports.deleteTask = (task) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM tasks WHERE id=?`,
      [task.id,],
      function (err) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};
