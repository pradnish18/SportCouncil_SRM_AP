const express = require('express');
const router = express.Router();
const { query } = require('../../lib/pg');

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT total_teams, total_members FROM stats WHERE id = $1', ['global-stats']);

    if (result.rows.length === 0) {
      return res.json({ totalTeams: 15, totalMembers: 500 });
    }

    return res.json({ totalTeams: result.rows[0].totalTeams, totalMembers: result.rows[0].totalMembers });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
