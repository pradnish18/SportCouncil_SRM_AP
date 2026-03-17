const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    sport: { type: String, required: true },
    category: { type: String, default: null }, // e.g., "Inter-University", "Hostel vs Hostel"
    venue: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, default: null },
    description: { type: String, default: null },
    stage: { type: String, default: "PLANNED" },

    // For LIVE stage
    team1: { type: String, default: null },
    team2: { type: String, default: null },
    score1: { type: String, default: null },
    score2: { type: String, default: null },
    liveUpdates: { type: String, default: null },

    // For PAST stage
    winner1st: { type: String, default: null },
    winner2nd: { type: String, default: null },
    matchDetails: { type: String, default: null },

    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
