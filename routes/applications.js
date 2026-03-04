const express = require('express');
const router = express.Router();
const Application = require('../models/Application'); 
const auth = require('../middleware/authMiddleware');


router.post('/apply', auth, async (req, res) => {
    try {
        const { studentId, universityId } = req.body;

        const newApplication = new Application({
            studentId,
            universityId
        });

        await newApplication.save();
        res.status(201).json({ msg: "Application submitted successfully!", data: newApplication });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/all', async (req, res) => {
    try {

        const apps = await Application.find()
            .populate('studentId', 'email')
            .populate('universityId', 'name');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;