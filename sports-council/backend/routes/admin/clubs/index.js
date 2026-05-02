const express = require('express');
const router = express.Router();
const { getDb, normalizeDoc } = require('../../../lib/mongo');

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const db = await getDb();
    const club = {
      id: body.id || new Date().valueOf().toString(),
      name: body.name,
      description: body.description,
      logoUrl: body.logoUrl,
      bgImageUrl: body.bgImageUrl,
      convenorName: body.convenor?.name,
      convenorRole: body.convenor?.role,
      convenorDetails: body.convenor?.details,
      coConvenorName: body.coConvenor?.name,
      coConvenorRole: body.coConvenor?.role,
      coConvenorDetails: body.coConvenor?.details,
      achievementsList: body.achievements ? JSON.stringify(body.achievements) : undefined,
      order: body.order ?? 0,
      gallery: body.gallery || [],
      players: body.players || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('clubs').insertOne(club);
    return res.status(201).json(normalizeDoc(club));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create club' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const db = await getDb();
    const update = {
      name: body.name,
      description: body.description,
      logoUrl: body.logoUrl,
      bgImageUrl: body.bgImageUrl,
      convenorName: body.convenor?.name,
      convenorRole: body.convenor?.role,
      convenorDetails: body.convenor?.details,
      coConvenorName: body.coConvenor?.name,
      coConvenorRole: body.coConvenor?.role,
      coConvenorDetails: body.coConvenor?.details,
      achievementsList: body.achievements ? JSON.stringify(body.achievements) : undefined,
      order: body.order ?? 0,
      updatedAt: new Date(),
    };

    if (Array.isArray(body.gallery)) {
      update.gallery = body.gallery;
    }
    if (Array.isArray(body.players)) {
      update.players = body.players;
    }

    const result = await db.collection('clubs').findOneAndUpdate(
      { id },
      { $set: update },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Club not found' });
    }

    return res.json(normalizeDoc(result.value));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update club' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.collection('clubs').deleteOne({ id });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete club' });
  }
});

module.exports = router;
