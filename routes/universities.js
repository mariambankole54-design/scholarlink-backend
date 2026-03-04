const express = require('express');
const router = express.Router();
const University = require('../models/Universities');

router.post('/add', async (req, res) => {
    try {
        const { name, location, fees, description } = req.body;

        const newUniversity = new University({
            name,
            location,
            fees,
            description
        });

        await newUniversity.save();
        res.status(201).json({ msg: "University added successfully!", data: newUniversity });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const universities = await University.find();
        res.json(universities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const updatedUniversity = await University.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        res.json({ msg: "University updated!", data: updatedUniversity });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        await University.findByIdAndDelete(req.params.id);
        res.json({ msg: "University deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/status/:id', async (req, res) => {
    try {
        const { status } = req.body; // Expecting 'accepted' or 'rejected'
        const updatedApp = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json({ msg: "Status updated!", data: updatedApp });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;