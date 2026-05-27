const express = require('express');
const router = express.Router();
const { getDb, normalizeArray, normalizeDoc } = require('../../lib/mongo');

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const clubs = await db.collection('clubs').find().sort({ order: 1 }).toArray();
    const events = await db.collection('events').find().toArray();

    const clubMap = new Map(clubs.map((club) => [club.id, club]));
    events.forEach((event) => {
      if (event.clubId && clubMap.has(event.clubId)) {
        const club = clubMap.get(event.clubId);
        club.events = club.events || [];
        club.events.push(normalizeDoc(event));
      }
    });

    return res.json(normalizeArray(clubs));
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

router.post('/join', async (req, res) => {
  try {
    const { clubId, name, email, message } = req.body;
    const db = await getDb();
    const request = {
      id: new Date().valueOf().toString(),
      clubId,
      name,
      email,
      message,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('clubJoinRequests').insertOne(request);
    return res.status(201).json({ success: true, request });
  } catch (error) {
    console.error('Error submitting join request:', error);
    return res.status(500).json({ error: 'Failed to submit join request' });
  }
});

module.exports = router;
