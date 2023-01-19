require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/schema");

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({ _id: verifyuser._id });

        req.token = token;
        req.user = user;
        req.name = user.firstname;

        next();
    } catch (e) {
        res.status(401).send(e);
    }
}

module.exports = auth;