const express = require('express');
const router = express.Router();
const { query } = require('../../../lib/pg');

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const id = body.id || new Date().valueOf().toString();
    const now = new Date();

    const result = await query(
      `INSERT INTO news (id, headline, image_url, "order", created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $5) RETURNING *`,
      [id, body.headline, body.imageUrl, body.order ?? 0, now]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create news' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const now = new Date();

    const result = await query(
      `UPDATE news SET headline = $1, image_url = $2, "order" = $3, updated_at = $4
       WHERE id = $5 RETURNING *`,
      [body.headline, body.imageUrl, body.order ?? 0, now, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News item not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update news' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM news WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete news' });
  }
});

module.exports = router;
