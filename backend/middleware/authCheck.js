// middleware/authCheck.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = "jatin123"
const authCheck = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded JWT:', decoded);
        const user = await User.findById(decoded.id);
        console.log('authCheck user:', user);
        if (!user) return res.status(401).json({ msg: 'User not found' });
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid', error: err.message });
    }
};

module.exports = authCheck;
