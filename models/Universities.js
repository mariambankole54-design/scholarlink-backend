const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    fees: { type: String, required: true },
    description: { type: String },

    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

module.exports = mongoose.model('University', UniversitySchema);