const express = require('express');
const router = express.Router();
const { query } = require('../../lib/pg');

router.get('/', async (req, res) => {
  try {
    const eventsResult = await query('SELECT * FROM events ORDER BY date ASC');
    const events = eventsResult.rows;

    const clubIds = [...new Set(events.filter((event) => event.club_id).map((event) => event.club_id))];
    let clubMap = new Map();
    if (clubIds.length > 0) {
      const placeholders = clubIds.map((_, i) => `$${i + 1}`).join(',');
      const clubsResult = await query(
        `SELECT id, name, logo_url FROM clubs WHERE id IN (${placeholders})`,
        clubIds
      );
      clubMap = new Map(clubsResult.rows.map((club) => [club.id, club]));
    }

    const normalized = events.map((event) => ({
      ...event,
      club: event.club_id ? clubMap.get(event.club_id) || null : null,
    }));

    return res.json(normalized);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;
