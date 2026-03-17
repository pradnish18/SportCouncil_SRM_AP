const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        default: null
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
