const express = require('express');
const router = express.Router();
const { query } = require('../../../lib/pg');

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const id = body.id || new Date().valueOf().toString();
    const now = new Date();

    const result = await query(
      `INSERT INTO clubs (id, name, description, logo_url, bg_image_url, convenor_name, convenor_role, convenor_details, co_convenor_name, co_convenor_role, co_convenor_details, coach_name, coach_role, coach_details, coach_photo_url, achievements_list, "order", gallery, players, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18::jsonb, $19::jsonb, $20, $20)
       RETURNING *`,
      [
        id, body.name || '', body.description || '', body.logoUrl || '', body.bgImageUrl || '',
        body.convenor?.name || '', body.convenor?.role || '', body.convenor?.details || '',
        body.coConvenor?.name || '', body.coConvenor?.role || '', body.coConvenor?.details || '',
        body.coach?.name || '', body.coach?.role || '', body.coach?.details || '', body.coach?.photoUrl || '',
        body.achievements ? JSON.stringify(body.achievements) : '',
        body.order ?? 0,
        JSON.stringify(body.gallery || []),
        JSON.stringify(body.players || []),
        now,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create club' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const now = new Date();

    const result = await query(
      `UPDATE clubs SET name = $1, description = $2, logo_url = $3, bg_image_url = $4,
       convenor_name = $5, convenor_role = $6, convenor_details = $7,
       co_convenor_name = $8, co_convenor_role = $9, co_convenor_details = $10,
       coach_name = $11, coach_role = $12, coach_details = $13, coach_photo_url = $14,
       achievements_list = $15, "order" = $16,
       gallery = CASE WHEN $17::jsonb IS NOT NULL THEN $17::jsonb ELSE gallery END,
       players = CASE WHEN $18::jsonb IS NOT NULL THEN $18::jsonb ELSE players END,
       updated_at = $19
       WHERE id = $20 RETURNING *`,
      [
        body.name || '', body.description || '', body.logoUrl || '', body.bgImageUrl || '',
        body.convenor?.name || '', body.convenor?.role || '', body.convenor?.details || '',
        body.coConvenor?.name || '', body.coConvenor?.role || '', body.coConvenor?.details || '',
        body.coach?.name || '', body.coach?.role || '', body.coach?.details || '', body.coach?.photoUrl || '',
        body.achievements ? JSON.stringify(body.achievements) : '',
        body.order ?? 0,
        Array.isArray(body.gallery) ? JSON.stringify(body.gallery) : null,
        Array.isArray(body.players) ? JSON.stringify(body.players) : null,
        now, id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Club not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update club' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM clubs WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete club' });
  }
});

module.exports = router;
