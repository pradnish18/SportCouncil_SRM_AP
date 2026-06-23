const express = require('express');
const router = express.Router();
const { query } = require('../../../lib/pg');

router.put('/', async (req, res) => {
  try {
    const body = req.body;
    const now = new Date();

    const result = await query(
      `INSERT INTO stats (id, total_teams, total_members, updated_at)
       VALUES ('global-stats', $1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET total_teams = $1, total_members = $2, updated_at = $3
       RETURNING *`,
      [body.totalTeams ?? 0, body.totalMembers ?? 0, now]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update stats' });
  }
});

module.exports = router;
