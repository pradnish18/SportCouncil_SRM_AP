const express = require('express');
const router = express.Router();
const { query } = require('../../../lib/pg');

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const id = body.id || new Date().valueOf().toString();
    const now = new Date();

    const result = await query(
       `INSERT INTO events (id, title, sport, venue, date, time, description, category, stage, team1, team2, score1, score2, live_updates, winner1st, winner2nd, match_details, club_id, registration_link, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $20)
        RETURNING *`,
       [
         id, body.title, body.sport, body.venue, new Date(body.date), body.time,
         body.description, body.category, body.stage || 'PLANNED',
         body.team1, body.team2, body.score1, body.score2,
         body.liveUpdates, body.winner1st, body.winner2nd, body.matchDetails,
         body.clubId, body.registrationLink || '', now,
       ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create event' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const now = new Date();

    const result = await query(
       `UPDATE events SET title = $1, sport = $2, venue = $3, date = $4, time = $5,
        description = $6, category = $7, stage = $8, team1 = $9, team2 = $10,
        score1 = $11, score2 = $12, live_updates = $13, winner1st = $14, winner2nd = $15,
        match_details = $16, registration_link = $17, updated_at = $18
        WHERE id = $19 RETURNING *`,
       [
         body.title, body.sport, body.venue, new Date(body.date), body.time,
         body.description, body.category, body.stage, body.team1, body.team2,
         body.score1, body.score2, body.liveUpdates, body.winner1st, body.winner2nd,
         body.matchDetails, body.registrationLink || '', now, id,
       ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM events WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
