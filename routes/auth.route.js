const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require("../middleware/authMiddleware");
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');

// to sign up. POST "/api/auth/signup"
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

//I am attempting to create an upload route here. I am attempting to use mutler with cloudinary
// /api/profile/updateprofile
router.post('/updateprofile', auth, async (req, res) => {
    
    // here you received the data from req.body
    console.log(req.body)
    console.log(req.user)

    try {
    const updatedUser = await User.findByIdAndUpdate (
    req.user.id,
    req.body,
    {new: true}
    );

    res.json(updatedUser);

} catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
}

    // then use findByIdAndUpdate for the user id (req.user.id)
    // update the user document with the info from the body.
    res.send("test for ok")
    // send an ok to the frontend

});

// I want students to upload documnts in student profile
router.post('/upload-docs', auth, upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        console.log(req.file.path)

        res.json({
            msg: 'Document uploaded successfully',
            url: req.file.path
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});



module.exports = router;