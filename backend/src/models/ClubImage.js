const mongoose = require('mongoose');

const clubImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ClubImage', clubImageSchema);
