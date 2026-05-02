const express = require('express');
const router = express.Router();
const { getDb, normalizeDoc } = require('../../../lib/mongo');

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const db = await getDb();
    const event = {
      id: body.id || new Date().valueOf().toString(),
      title: body.title,
      sport: body.sport,
      venue: body.venue,
      date: new Date(body.date),
      time: body.time,
      description: body.description,
      category: body.category,
      stage: body.stage || 'PLANNED',
      team1: body.team1,
      team2: body.team2,
      score1: body.score1,
      score2: body.score2,
      liveUpdates: body.liveUpdates,
      winner1st: body.winner1st,
      winner2nd: body.winner2nd,
      matchDetails: body.matchDetails,
      clubId: body.clubId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('events').insertOne(event);
    return res.status(201).json(normalizeDoc(event));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create event' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const db = await getDb();
    const result = await db.collection('events').findOneAndUpdate(
      { id },
      {
        $set: {
          title: body.title,
          sport: body.sport,
          venue: body.venue,
          date: new Date(body.date),
          time: body.time,
          description: body.description,
          category: body.category,
          stage: body.stage,
          team1: body.team1,
          team2: body.team2,
          score1: body.score1,
          score2: body.score2,
          liveUpdates: body.liveUpdates,
          winner1st: body.winner1st,
          winner2nd: body.winner2nd,
          matchDetails: body.matchDetails,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.json(normalizeDoc(result.value));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.collection('events').deleteOne({ id });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
