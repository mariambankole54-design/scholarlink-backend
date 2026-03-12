const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const token = req.header('x-auth-token');

    // console.log(token);


    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decoded)
        req.user = decoded;
        next(); 
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;