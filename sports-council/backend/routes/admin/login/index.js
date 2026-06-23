const express = require('express');
const router = express.Router();
const { query } = require('../../../lib/pg');

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await query('SELECT * FROM admins WHERE username = $1', [username]);

    if (result.rows.length === 0 || result.rows[0].password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    return res.json({
      id: admin.id,
      username: admin.username,
      role: admin.role,
      clubId: admin.clubId,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
