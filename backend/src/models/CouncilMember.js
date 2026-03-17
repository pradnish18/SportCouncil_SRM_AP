const mongoose = require('mongoose');

const councilMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        default: null
    },
    tier: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('CouncilMember', councilMemberSchema);
