const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

// Create a table (if not exists)
db.run(
  'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, phone INTEGER, vahicalNO TEXT)'
);

// Middleware to protect /trunk endpoint
const protectTrunkEndpoint = (req, res, next) => {
  // Check for a custom header (you can modify this based on your authentication/authorization mechanism)
  const apiKey = req.headers['x-api-key'];

  // Add your security logic here
  if (apiKey === 'your_secret_key') {
    // If the key is valid, proceed to the next middleware or route handler
    next();
  } else {
    // If the key is invalid, send a forbidden response
    res.status(403).json({ error: 'Access forbidden' });
  }
};

// Create endpoint to insert data
async function Insert(req, res) {
  // app.get('/insert', (req, res) => {
  const { name, phone, vahicalNO } = req.query;
  if (!name || !phone || !vahicalNO || isNaN(phone)) {
    return res.status(400).json({
      error:
        'Invalid input. Name, phone, and vahicalNO are required parameters.',
    });
  }
  // if (!name || !phone || !vahicalNO) {
  //   return res.status(400).json({ error: 'Name and phone are required parameters.' });
  // }

  db.run(
    'INSERT INTO users (name, phone, vahicalNO) VALUES (?, ?, ?)',
    [name, phone, vahicalNO],
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

// Create endpoint to query data for a specific user with ID
// app.use('/getbyID/:id', protectTrunkEndpoint);
async function GetByID(req, res) {
  const userId = req.params.id; // Specify the user ID you want to retrieve
  db.all('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
}

// Create endpoint to query data for a specific user with vahicalNO

async function GetByVno(req, res) {
  const vahicalNO = req.params.vahicalNO; // Specify the user ID you want to retrieve
  db.all(
    'SELECT * FROM users WHERE vahicalNO = ?',
    [vahicalNO],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
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

// Apply the middleware only to the /trunk endpoint
// app.use('/trunk', protectTrunkEndpoint);

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

module.exports = { Insert, GetUsers, GetByID, GetByVno, DeleteByID, Trunk };
