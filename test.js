const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const db = new sqlite3.Database('database.db');

// Function to hash the password with the salt
function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const hashedPassword = hashPassword(password, salt);
