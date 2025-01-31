const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// In-memory database for users
const users = [];
const adminSecret = speakeasy.generateSecret({ length: 20 }); // Secret for admin MFA

// Passport setup for Google OAuth
passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET', // Replace with your Google Client Secret
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Save user profile or log them in
  done(null, profile);
}));

app.use(passport.initialize());

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/dashboard');
});

// User Signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, email, password: hashedPassword, isAdmin: isAdmin || false });
  res.status(201).json({ message: 'User created successfully' });
});

// User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, 'secret_key');
  res.json({ token, isAdmin: user.isAdmin });
});

// Admin MFA Verification
app.post('/api/verify-otp', (req, res) => {
  const { token } = req.body;
  const verified = speakeasy.totp.verify({
    secret: adminSecret.base32,
    encoding: 'base32',
    token,
  });
  if (verified) {
    res.json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});