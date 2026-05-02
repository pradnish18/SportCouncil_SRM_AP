const express = require('express');
const router = express.Router();
const { getDb, normalizeDoc } = require('../../../lib/mongo');

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const db = await getDb();
    const item = {
      id: body.id || new Date().valueOf().toString(),
      headline: body.headline,
      imageUrl: body.imageUrl,
      order: body.order ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('news').insertOne(item);
    return res.status(201).json(normalizeDoc(item));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create news' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const db = await getDb();
    const result = await db.collection('news').findOneAndUpdate(
      { id },
      {
        $set: {
          headline: body.headline,
          imageUrl: body.imageUrl,
          order: body.order ?? 0,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'News item not found' });
    }

    return res.json(normalizeDoc(result.value));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update news' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.collection('news').deleteOne({ id });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete news' });
  }
});

module.exports = router;
