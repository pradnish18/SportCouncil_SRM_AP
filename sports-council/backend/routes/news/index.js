const express = require('express');
const router = express.Router();
const { getDb, normalizeArray } = require('../../lib/mongo');

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const news = await db.collection('news').find().sort({ order: 1 }).toArray();
    return res.json(normalizeArray(news));
  } catch (error) {
    console.error('Error fetching news:', error);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
