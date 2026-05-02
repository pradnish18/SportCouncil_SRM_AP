const express = require('express');
const router = express.Router();
const { getDb } = require('../../../lib/mongo');

router.put('/', async (req, res) => {
  try {
    const body = req.body;
    const db = await getDb();
    const result = await db.collection('stats').findOneAndUpdate(
      { id: 'global-stats' },
      {
        $set: {
          totalTeams: body.totalTeams ?? 0,
          totalMembers: body.totalMembers ?? 0,
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    return res.json(result.value);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update stats' });
  }
});

module.exports = router;
