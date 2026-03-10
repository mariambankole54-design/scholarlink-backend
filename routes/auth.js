const express = require('express');
const router = express.Router();
const signup = require('../routes/authSignup');
const login = require('../routes/authLogin');

router.get('/', (req, res) => {
    res.json({ msg: 'Auth API OK' });
});

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;