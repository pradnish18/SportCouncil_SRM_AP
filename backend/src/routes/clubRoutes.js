const express = require('express');
const router = express.Router();
const { getClubs, getClub, createClub } = require('../controllers/clubController');

router.route('/')
    .get(getClubs)
    .post(createClub);

router.route('/:id')
    .get(getClub);

module.exports = router;
