const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({

    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },

    universityId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'University', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);