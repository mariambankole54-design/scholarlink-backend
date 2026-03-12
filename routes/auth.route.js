const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require("../middleware/authMiddleware");

// to sign up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user exists already. 
    const foundUser = await User.findOne({ email });
    if (foundUser) return res.status(400).json({ message: "User already exists" });

    //  password security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // to create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    res.status(201).json({ 
      message: "User created successfully",
      user: { id: newUser._id, name: newUser.name, role: newUser.role }
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

// to login. POST "/api/auth/login"
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // to find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // compare password to see if it is the same 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // to create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // to send back response
    res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

// to verify the token
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({ payload: req.payload });
});

module.exports = router;