const Club = require('../models/Club');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
exports.getClubs = async (req, res) => {
    try {
        const clubs = await Club.find().sort({ order: 1 });
        res.status(200).json(clubs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Public
exports.getClub = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.status(200).json(club);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private
exports.createClub = async (req, res) => {
    try {
        const newClub = await Club.create(req.body);
        res.status(201).json(newClub);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
