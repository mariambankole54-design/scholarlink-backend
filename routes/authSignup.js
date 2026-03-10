const User = require('../models/User');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;


        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

   
        user = new User({ name, email, password, role });


        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);


        await user.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = signup;