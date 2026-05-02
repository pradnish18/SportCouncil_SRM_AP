const express = require('express');
const router = express.Router();
const { getDb } = require('../../lib/mongo');

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const stats = await db.collection('stats').findOne({ id: 'global-stats' });

    if (!stats) {
      return res.json({ totalTeams: 15, totalMembers: 500 });
    }

    return res.json({ totalTeams: stats.totalTeams, totalMembers: stats.totalMembers });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
