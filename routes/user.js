const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Application = require('../models/Application');

router.put('/profile/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...otherData } = updatedUser._doc;
    res.status(200).json(otherData);

  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server error during profile update", error: err.message });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

module.exports = router;