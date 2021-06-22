const jwt = require('jsonwebtoken');
require("dotenv").config();


module.exports = function (req, res, next) {

    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, Authorized denied' })
    }

    //verify token
    try {
        const decode = jwt.verify(token, process.env.JWT_SECERET);

        req.user = decode.user;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Token is not Invalid" });
    }
}