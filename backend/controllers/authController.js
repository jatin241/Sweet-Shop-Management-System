const User = require('../models/userModel')
const jwt=   require('jsonwebtoken')
require('dotenv').config()


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

async function register(req,res){
    try {
        const { email, password, isAdmin } = req.body;
        if (!email || !password) {
            return res.status(404).json({ msg: "email and password missing" })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "user already exists" });
        }
        // Only allow isAdmin if explicitly set, default to false
        const user = new User({
            email,
            password,
            isAdmin: isAdmin === true // only true if explicitly set to true
        });
        await user.save();
        res.status(201).json({ msg: "user created" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "server error" });
    }
}
function generateToken(user) {
    return jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { id: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ msg: "missing email or password" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ msg: "user not found" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(404).json({ msg: "password did not match" })
        }
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        res.status(200).json({
            token,
            refreshToken,
            user: { email: user.email, isAdmin: user.isAdmin }
        });
    } catch (err) {
        console.log("login err", err);
        res.status(500).json({ msg: "server error" })
    }
}

// Refresh token endpoint
async function refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ msg: 'No refresh token provided' });
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ msg: 'User not found' });
        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ msg: 'Invalid refresh token', error: err.message });
    }
}
module.exports={register,login,refreshToken};