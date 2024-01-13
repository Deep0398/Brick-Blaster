
import Jwt from 'jsonwebtoken';

import {error}from "../utills/responseWrapper.utills.js";


const secretKey = "greenwebsolutions";

export async function checkUserLogin(req,res,next){
    try {
        if (!req.headers?.authorization?.startsWith("Bearer")){
            return res.send(error(401,"authorization header is required"));
           }
        const accessToken = req.headers.authorization.split(" ")[1];
        const decoded = Jwt.verify(accessToken,secretKey);
        req._id = decoded?._doc?._id;
        next();
    } catch (err) {
        return res.send(error(500,err.message));
    }
}


export async function checkAdminLogin(req,res,next){
    try {
        if (!req.headers?.authorization?.startsWith("Bearer")){
            return res.send(error(401,"authorization header is required"));
           }
        const accessToken = req.headers.authorization.split(" ")[1];
        const decoded = Jwt.verify(accessToken,secretKey);
        req._id = decoded?._doc?._id;
        next();
    } catch (err) {
        return res.send(error(500,err.message));
    }
}