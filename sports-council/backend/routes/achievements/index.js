const express = require('express');
const router = express.Router();
const { getDb, normalizeArray } = require('../../lib/mongo');

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const achievements = await db.collection('achievements').find().sort({ date: -1 }).toArray();
    return res.json(normalizeArray(achievements));
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

module.exports = router;
