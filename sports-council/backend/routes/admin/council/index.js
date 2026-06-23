const express = require('express');
const router = express.Router();
const { query } = require('../../../lib/pg');

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const id = body.id || new Date().valueOf().toString();
    const now = new Date();

    const result = await query(
      `INSERT INTO council_members (id, name, title, photo_url, tier, "order", created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $7) RETURNING *`,
      [id, body.name, body.title, body.photoUrl, body.tier || 'STUDENT_BODY', body.order ?? 0, now]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create council member' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const now = new Date();

    const result = await query(
      `UPDATE council_members SET name = $1, title = $2, photo_url = $3, tier = $4, "order" = $5, updated_at = $6
       WHERE id = $7 RETURNING *`,
      [body.name, body.title, body.photoUrl, body.tier, body.order ?? 0, now, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Council member not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update council member' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM council_members WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete council member' });
  }
});

module.exports = router;
