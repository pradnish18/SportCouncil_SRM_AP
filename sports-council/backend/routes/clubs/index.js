const express = require('express');
const router = express.Router();
const { query } = require('../../lib/pg');

router.get('/', async (req, res) => {
  try {
    const clubsResult = await query('SELECT * FROM clubs ORDER BY "order" ASC');
    const eventsResult = await query('SELECT * FROM events');

    const clubs = clubsResult.rows;
    const events = eventsResult.rows;

    const clubMap = new Map(clubs.map((club) => [club.id, club]));
    events.forEach((event) => {
      if (event.club_id && clubMap.has(event.club_id)) {
        const club = clubMap.get(event.club_id);
        club.events = club.events || [];
        club.events.push(event);
      }
    });

    return res.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

router.post('/join', async (req, res) => {
  try {
    const { clubId, name, email, message } = req.body;
    const id = new Date().valueOf().toString();
    const now = new Date();

    await query(
      `INSERT INTO club_join_requests (id, club_id, name, email, message, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'PENDING', $6, $6)`,
      [id, clubId, name, email, message, now]
    );

    return res.status(201).json({
      success: true,
      request: { id, clubId, name, email, message, status: 'PENDING', createdAt: now, updatedAt: now },
    });
  } catch (error) {
    console.error('Error submitting join request:', error);
    return res.status(500).json({ error: 'Failed to submit join request' });
  }
});

module.exports = router;
