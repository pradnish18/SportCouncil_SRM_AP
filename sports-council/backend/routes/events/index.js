const express = require('express');
const router = express.Router();
const { getDb, normalizeArray } = require('../../lib/mongo');

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const events = await db.collection('events').find().sort({ date: 1 }).toArray();
    const clubIds = [...new Set(events.filter((event) => event.clubId).map((event) => event.clubId))];
    const clubs = await db.collection('clubs').find({ id: { $in: clubIds } }).project({ id: 1, name: 1, logoUrl: 1 }).toArray();
    const clubMap = new Map(clubs.map((club) => [club.id, club]));

    const normalized = events.map((event) => ({
      ...event,
      id: event.id || (event._id ? event._id.toString() : undefined),
      club: event.clubId ? clubMap.get(event.clubId) || null : null,
    }));

    normalized.forEach((item) => delete item._id);

    return res.json(normalized);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;
