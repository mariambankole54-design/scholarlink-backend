const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['student', 'admin'], 
        default: 'student' 
    },

    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    gender: { type: String },
    dob: { type: Date },
    studyLevel: { type: String },
    courseType: { type: String },
    courseChoice1: { type: String },
    courseChoice2: { type: String },
    courseChoice3: { type: String },
    budget: { type: String },
    country: { type: String },
    targetCountries: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);