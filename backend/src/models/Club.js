const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: { type: String, default: null },
    logoUrl: { type: String, default: null },
    bgImageUrl: { type: String, default: null },
    convenorName: { type: String, default: null },
    convenorRole: { type: String, default: null },
    convenorDetails: { type: String, default: null },
    coConvenorName: { type: String, default: null },
    coConvenorRole: { type: String, default: null },
    coConvenorDetails: { type: String, default: null },
    achievementsList: { type: String, default: null }, // JSON stringified array of achievements
    order: { type: Number, default: 0 }
}, { timestamps: true });

// Virtuals for relations to match Prisma if needed:
// clubSchema.virtual('players', { ref: 'Player', localField: '_id', foreignField: 'clubId' });
// clubSchema.virtual('gallery', { ref: 'ClubImage', localField: '_id', foreignField: 'clubId' });

module.exports = mongoose.model('Club', clubSchema);
