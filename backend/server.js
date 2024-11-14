const express = require('express');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Body parser middleware
app.use(express.json());

// PostgreSQL client setup
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'sipweb1_db',
  password: 'theDatabase',  // Change this to your PostgreSQL password
  port: 5432,
});

client.connect();

// Endpoint for login
app.post('/login', async (req, res) => {
  const { username, password, mobile } = req.body;
  
  // Check if user exists
  const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
  
  if (result.rows.length === 0) {
    return res.status(400).json({ message: 'User not found' });
  }

  const user = result.rows[0];

  // Check password
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  // If first-time login, send OTP (simplified here)
  if (!user.otp_verified) {
    const otp = Math.floor(100000 + Math.random() * 900000);  // Generate random OTP
    // Store OTP or send it via SMS (mocked here)
    console.log(`OTP for ${username}: ${otp}`);

    // Send response
    return res.json({ message: 'OTP required for first-time login', generatedOtp: otp });
  }

  // If login is successful
  const token = jwt.sign({ userId: user.id }, 'yourjwtsecret', { expiresIn: '1h' });
  res.json({ message: 'Login successful, OTP not required', token });
});

// Endpoint for OTP verification
app.post('/verify-otp', async (req, res) => {
  const { username, otp } = req.body;
  
  // Verify OTP (mocked here)
  console.log(`OTP for ${username}: ${otp}`);
  // Update user to mark OTP as verified
  await client.query('UPDATE users SET otp_verified = TRUE WHERE username = $1', [username]);

  // Send response
  const token = jwt.sign({ username }, 'yourjwtsecret', { expiresIn: '1h' });
  res.json({ message: 'OTP verified successfully!', token });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});