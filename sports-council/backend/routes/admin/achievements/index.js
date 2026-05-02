const express = require('express');
const router = express.Router();
const { getDb, normalizeDoc } = require('../../../lib/mongo');

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const db = await getDb();
    const achievement = {
      id: body.id || new Date().valueOf().toString(),
      title: body.title,
      description: body.description,
      photoUrl: body.photoUrl,
      date: new Date(body.date),
      sport: body.sport,
      category: body.category || 'TROPHY',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('achievements').insertOne(achievement);
    return res.status(201).json(normalizeDoc(achievement));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create achievement' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const db = await getDb();
    const result = await db.collection('achievements').findOneAndUpdate(
      { id },
      {
        $set: {
          title: body.title,
          description: body.description,
          photoUrl: body.photoUrl,
          date: new Date(body.date),
          sport: body.sport,
          category: body.category,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    return res.json(normalizeDoc(result.value));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update achievement' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.collection('achievements').deleteOne({ id });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

module.exports = router;
