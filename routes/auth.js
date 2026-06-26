const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

/**
 * POST /api/auth/login
 * Authenticates user session with password
 */
router.post('/login', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required.' });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.error('Security Alert: ADMIN_PASSWORD_HASH is not defined in the environment config.');
    return res.status(500).json({ success: false, message: 'Authentication is temporarily misconfigured on the server.' });
  }

  try {
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please try again.' });
    }

    // Set session parameters
    req.session.isAuthenticated = true;
    res.json({ success: true, message: 'Login successful.' });
  } catch (err) {
    console.error('Bcrypt comparison error:', err);
    res.status(500).json({ success: false, message: 'An error occurred during authentication.' });
  }
});

/**
 * POST /api/auth/logout
 * Destroys session
 */
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ success: false, message: 'Could not log out.' });
    }
    res.clearCookie('connect.sid'); // Clear Express default session cookie
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});

/**
 * GET /api/auth/status
 * Check current authentication state
 */
router.get('/status', (req, res) => {
  const authenticated = !!(req.session && req.session.isAuthenticated);
  res.json({ authenticated });
});

module.exports = router;
