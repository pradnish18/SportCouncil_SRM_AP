const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    headline: { type: String, required: true },
    imageUrl: { type: String, default: null },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
