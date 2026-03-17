const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: null },
    photoUrl: { type: String, default: null },
    date: { type: Date, required: true },
    sport: { type: String, required: true },
    category: { type: String, default: "TROPHY" }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
