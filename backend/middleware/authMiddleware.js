import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

//Protect Middleware
const protect = asyncHandler(async (req, res, next) => {
    let token;

    //Read the JWT from the cookie
    token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("Not Authorized,token failed");
        }
    } else {
        res.status(401);
        throw new Error("Not Authorized,no token");
    }
});

//Admin Middleware
const admin = (req, res, next) => {
    console.log(req.user.isAdmin);
    if(req.user && req.user.isAdmin) {
        next();
    }else{
        console.log('not admin');
        res.status(401);
        throw new Error("Not Authorized as admin");
    }
};

export { protect, admin };