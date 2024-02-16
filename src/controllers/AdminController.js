import adminModel from "../models/Admin.js"
import {userModel} from "../models/User.js";
import bcrypt from 'bcrypt'
import { generateAccessToken } from "../services/generateAccessToken.service.js";
import { error, success } from "../utills/responseWrapper.utills.js";

export async function adminSignupController(req,res){
    try {
        const {username,password,email} = req.body;
        if(!username || !password || !email){
            return res.send(error(404,"insufficient data"));
        }
        const hashedPassword = await bcrypt.hash(password,10);
        req.body["password"] = hashedPassword;
        const user = await adminModel.create(req.body);
        return res.send(success(200,"admin signup successfully"));

    } catch (err) {
        return res.send(success(500,err.message));
    }

}
export async function adminLoginController(req,res){
  try {
    
    const {username,password} = req.body;
    const user = await adminModel.findOne({
        $or:[{username:username}, {password:password}]
    });
    if(!user){
        return res.send(error(404,"user not found"));
    }

    const matched = await bcrypt.compare(password,user.password);
    if(!matched){
        return res.send(error(401,"Anuthorized access"));
    }

    const accessToken = generateAccessToken({...user})
    
   
   

    return res.send(success(200,accessToken));
    
} catch (err) {
    return res.send(error(500,err.message));
}


}


export async function getAllUsersController(req,res){
  try {
      const users = await userModel.find({}).populate('achievements').populate('levels');
      return res.send(success(200,users));
  } catch (err) {
      return res.send(error(500,err.message));
  }
}
