const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = asyncHandler(async (req,res,next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            const user = await User.findById(decoded?.id);
            req.user = user;
            next();
        } else {
            throw new Error("Not Authorized token expried, Please login again!");
        }
    } else {
        throw new Error("There is no token attached to headers");
    }
});

const isAdminMiddleware = asyncHandler(async (req,res,next) => {
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== "admin") {
        throw new Error("You are not admin");
    } else {
        next();
    }
});

module.exports = {authMiddleware,isAdminMiddleware};