const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const db = new sqlite3.Database('database.db');

// Create a table (if not exists)
// db.run(
//   'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, phone INTEGER, vahicalNO TEXT, hash TEXT)'
// );


// Function to hash the password with the salt
function hashPassword(name, phone, vahicalNO) {
  combine = name + phone + vahicalNO;
  return crypto.createHash('sha256').update(combine).digest('hex');
}

// Create endpoint to insert data
async function Insert(req, res) {
  const { name, phone, vahicalNO } = await req.body;
  const hashedKey = hashPassword(name, phone, vahicalNO);
  if (!name || !phone || !vahicalNO || isNaN(phone)) {
    return res.status(400).json({
      error:
        'Invalid input. Name, phone, and vahicalNO are required parameters.',
    });
  }
  db.run(
    'INSERT INTO users (name, phone, vahicalNO, hash) VALUES (?, ?, ?, ?)',
    [name, phone, vahicalNO, hashedKey],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Data inserted successfully!' });
    }
  );
}

// Create endpoint to query data for  all data
async function GetUsers(req, res) {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
}

// Create endpoint to query data for a specific user with  ID or vahicalNO
async function GetInfo(req, res) {
  const Param = req.params.Param;
  const tyPe = req.params.type;
  if (tyPe.includes('hash')) {
    // Query data for a specific user with ID
    db.all('SELECT * FROM users WHERE hash = ?', [Param], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  } else if (tyPe.includes('Vno')) {
    db.all('SELECT * FROM users WHERE vahicalNO = ?', [Param], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  }
}

// Create endpoint to delete data
async function DeleteByID(req, res) {
  const userId = req.params.id;
  db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Data deleted successfully!' });
  });
}


// Create endpoint to TRUNCATE data
async function Trunk(req, res) {
  db.run('DELETE FROM users', (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Data deleted successfully!' });
  });
}

// Close the database connection when the app is terminated
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit();
  });
});

module.exports = {
  Insert,
  GetUsers,
  DeleteByID,
  Trunk,
  GetInfo
};
