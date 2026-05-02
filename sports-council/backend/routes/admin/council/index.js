const express = require('express');
const router = express.Router();
const { getDb, normalizeDoc } = require('../../../lib/mongo');

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const db = await getDb();
    const member = {
      id: body.id || new Date().valueOf().toString(),
      name: body.name,
      title: body.title,
      photoUrl: body.photoUrl,
      tier: body.tier || 'STUDENT_BODY',
      order: body.order ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('councilMembers').insertOne(member);
    return res.status(201).json(normalizeDoc(member));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create council member' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const db = await getDb();
    const result = await db.collection('councilMembers').findOneAndUpdate(
      { id },
      {
        $set: {
          name: body.name,
          title: body.title,
          photoUrl: body.photoUrl,
          tier: body.tier,
          order: body.order ?? 0,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Council member not found' });
    }

    return res.json(normalizeDoc(result.value));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update council member' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.collection('councilMembers').deleteOne({ id });
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete council member' });
  }
});

module.exports = router;
