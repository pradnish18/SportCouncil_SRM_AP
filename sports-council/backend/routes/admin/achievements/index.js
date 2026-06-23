const express = require('express');
const router = express.Router();
const { query } = require('../../../lib/pg');

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const id = body.id || new Date().valueOf().toString();
    const now = new Date();

    const result = await query(
      `INSERT INTO achievements (id, title, description, photo_url, date, sport, category, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
       RETURNING *`,
       [id, body.title, body.description, body.photoUrl || '', new Date(body.date), body.sport, body.category || 'TROPHY', now]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create achievement' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const now = new Date();

    const result = await query(
      `UPDATE achievements SET title = $1, description = $2, photo_url = $3, date = $4, sport = $5, category = $6, updated_at = $7
       WHERE id = $8 RETURNING *`,
      [body.title, body.description, body.photoUrl || '', new Date(body.date), body.sport, body.category, now, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update achievement' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM achievements WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

module.exports = router;
