const express = require('express');
const router = express.Router();
const { query } = require('../../lib/pg');

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM news ORDER BY "order" ASC');
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
