const express = require('express');
const router = express.Router();
const { getDb } = require('../../../lib/mongo');

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const db = await getDb();
    const admin = await db.collection('admins').findOne({ username });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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
