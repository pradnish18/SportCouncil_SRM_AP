const express = require('express');
const router = express.Router();
const { query } = require('../../lib/pg');

router.post('/', async (req, res) => {
  try {
    const {
      fullName, email, registrationNumber, department,
      yearOfStudy, phoneNumber, interestedClubs,
      skills, previousExperience, statement,
    } = req.body;

    if (!fullName || !email || !registrationNumber || !department || !yearOfStudy || !phoneNumber || !interestedClubs || !skills || !statement) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const id = new Date().valueOf().toString();
    const now = new Date();
    const clubsArray = Array.isArray(interestedClubs) ? interestedClubs : [interestedClubs];

    await query(
      `INSERT INTO club_registrations (id, full_name, email, registration_number, department, year_of_study, phone_number, interested_clubs, skills, previous_experience, statement, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, 'PENDING', $12, $12)`,
      [id, fullName, email.toLowerCase(), registrationNumber, department, yearOfStudy, phoneNumber, JSON.stringify(clubsArray), skills, previousExperience || '', statement, now]
    );

    return res.status(201).json({
      success: true,
      registration: { id, fullName, email: email.toLowerCase(), registrationNumber, department, yearOfStudy, phoneNumber, interestedClubs: clubsArray, skills, previousExperience: previousExperience || '', statement, status: 'PENDING', createdAt: now, updatedAt: now },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to submit registration' });
  }
});

module.exports = router;
