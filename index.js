require('dotenv').config();
const express = require('express');
const pool = require('./db'); // Your PostgreSQL pool connection

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Test DB Connection
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`✅ PostgreSQL connected: ${result.rows[0].now}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Error connecting to DB');
  }
});

// ✅ Login API (Store OTP or Create User)
app.post('/api/login', async (req, res) => {
  const { phone_number, otp } = req.body;

  if (!phone_number || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    const existing = await pool.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [phone_number]
    );

    if (existing.rows.length > 0) {
      // Update existing user's OTP
      await pool.query(
        'UPDATE users SET otp = $1 WHERE phone_number = $2',
        [otp, phone_number]
      );
    } else {
      // Insert new user with OTP
      await pool.query(
        'INSERT INTO users (phone_number, otp) VALUES ($1, $2)',
        [phone_number, otp]
      );
    }

    res.status(200).json({ message: 'OTP saved successfully' });
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Verify OTP API
app.post('/api/verify', async (req, res) => {
  const { phone_number, otp } = req.body;

  if (!phone_number || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE phone_number = $1 AND otp = $2',
      [phone_number, otp]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: '✅ OTP verified successfully' });
    } else {
      res.status(401).json({ error: '❌ Invalid OTP' });
    }
  } catch (error) {
    console.error('Verify OTP API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
