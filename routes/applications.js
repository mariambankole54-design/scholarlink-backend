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
      universityId,
      status: 'pending'
    });

    await newApplication.save();
    res.status(201).json({ msg: "Application submitted successfully!", data: newApplication });
  } catch (err) {
    next(err)
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

router.get('/student/:studentId', async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.params.studentId })
      .populate('universityId', 'name')
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/me
router.get('/me', auth, async (req, res) => {
  try {
    const studentId = req.userId;

    if (!studentId) {
      return res.status(401).json({ error: 'Unauthorized: student id not found on token' });
    }

    const apps = await Application.find({ studentId })
      .populate('universityId', 'name, country')
      .sort({ appliedAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*I am adding a delete button to only work if application is pending. as soon as it moved to "In Progress", it can no longer be deleted */

router.delete('/delete/:id', async (req, res) => {
  try {

    console.log("works")

    const app = await Application.findOneAndDelete({
      _id: req.params.id,
    });

    console.log(req.params.id);

    /*const app = await Application.findById(req.params.id); */

    if (!app) {
      return res.status(404).json({ msg: "Application not found" });
    }

    console.log("working delete")

    // Only allow deletion if status is 'pending'
    /* if (app.status !== 'pending') {
       return res.status(400).json({ msg: "Cannot delete an application that is already in progress or completed." });
     }*/

    await Application.findByIdAndDelete(req.params.id);
    res.json({ msg: "Application withdrawn successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    next(err);
  }
});

module.exports = router;