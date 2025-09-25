// middleware/adminCheck.js

function adminCheck(req, res, next) {
    console.log('adminCheck req.user:', req.user);
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({ msg: 'Access denied: Admins only' });
}

module.exports = adminCheck;
