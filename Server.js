// server.js
const express = require('express');
const dotenv = require('dotenv');
const pool = require('./db');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 Welcome to My Simple API!');
});

// ✅ Login API - Validate username and password
app.post('/login',async (req, res) => {
  const { username, code } = req.body;

 // if (!username || !code) {
   // return res.status(400).json({ success: false, message: 'Username and code are required' });
  //}
  console.log(`${username}:${code}`)
console.log(req.body)
 try {
    const result = await pool.query(
      'SELECT * FROM movietickets.users WHERE username = $1 AND code = $2',
      [username, code]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: '✅ Login successful!' });
    } else {
      res.status(401).json({ success: false, message: '❌ Invalid credentials' });
    }
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
