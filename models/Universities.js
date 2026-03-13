const mongoose = require('mongoose');

const UniversitiesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    fees: { type: String },
    description: { type: String },

    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Universities', UniversitiesSchema);