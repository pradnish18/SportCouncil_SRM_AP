const express = require('express');
const router = express.Router();
const { getDb, normalizeArray } = require('../../lib/mongo');

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const members = await normalizeArray(await db.collection('councilMembers').find().sort({ order: 1 }).toArray());

    const groupedMembers = {
      DIRECTOR: members.filter((m) => m.tier === 'DIRECTOR'),
      CONVENOR: members.filter((m) => m.tier === 'CONVENOR'),
      COACH: members.filter((m) => m.tier === 'COACH'),
      STUDENT_BODY: members.filter((m) => m.tier === 'STUDENT_BODY'),
    };

    return res.json(groupedMembers);
  } catch (error) {
    console.error('Error fetching council members:', error);
    return res.status(500).json({ error: 'Failed to fetch council members' });
  }
});

module.exports = router;
