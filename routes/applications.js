const express = require('express');
const router = express.Router();
const Application = require('../models/Application'); 
const auth = require('../middleware/authMiddleware');

// POST /api/applications/apply
router.post('/apply', auth, async (req, res, next) => {
    try {
        const { studentId, universityId } = req.body;

        // here i explain what this does
        const newApplication = new Application({
            studentId,
            universityId
        });

        await newApplication.save();
        res.status(201).json({ msg: "Application submitted successfully!", data: newApplication });
    } catch (err) {
        next(err)
    }
});

/*commenting it out to try something else
router.get('/all', async (req, res) => {
    try {

        const apps = await Application.find()
            .populate('studentId', 'email')
            .populate('universityId', 'name');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); */

router.get('/student/:studentId', async (req, res) => {
    try {
        const apps = await Application.find({ studentId: req.params.studentId })
            .populate('universityId', 'name')
            .sort({ appliedAt: -1 });
        
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;