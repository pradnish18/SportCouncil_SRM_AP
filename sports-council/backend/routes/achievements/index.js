const express = require('express');
const router = express.Router();
const { query } = require('../../lib/pg');

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM achievements ORDER BY date DESC');
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

module.exports = router;
