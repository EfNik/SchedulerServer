const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');

    // Create Tasks table
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY ,
      name TEXT,
      startDate TEXT,
      endDate TEXT,
      percentDone INTEGER,
      note TEXT
    )`);

    // Create People table
    db.run(`CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY ,
      name TEXT,
      team TEXT
    )`);

    // Create Assignments table (with foreign keys)
    db.run(`CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY ,
      event TEXT,
      resource TEXT,
      FOREIGN KEY(event) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY(resource) REFERENCES people(id)
    )`);
  }
});

module.exports = db;
