import { guestModel } from "../models/User.js";
import { authModel } from "../models/User.js";
import { userModel } from "../models/User.js"
import { generateAccessToken } from "../services/generateAccessToken.service.js";
import { error, success } from "../utills/responseWrapper.utills.js";
import { generateUniqueReferralCode } from "../services/generateReferalCode.js";

 
export async function authenticLoginController(req,res){
  try {
     
  
      const {deviceID,name,email,profileURL} = req.body;
      if(!name || !email ||!deviceID){
          return res.send(error(422,"insufficient data"));
      }


      const existingUser =  await authModel.findOne({email});
  
      const referralCode =  generateUniqueReferralCode();
      console.log(referralCode);
    
      if(!existingUser){
       
          const newUser = new userModel({deviceID,name,email,profileURL,referralCode});
           const createUser = await newUser.save();
          const accessToken = generateAccessToken({...createUser});
          return res.send(success(200, { accessToken, isNewUser: true }));
      }

      //  if user already present
      existingUser.name = name;
      existingUser.email = email;
      existingUser.profileURL = profileURL;
      await existingUser.save();
      const accessToken = generateAccessToken({...existingUser});
      return res.send(success(200, { accessToken, isNewUser: false }));
     
  }catch (err){
      return res.send(error(500,err.message));
  }
}

export async function guestLoginController(req, res) {
  try {
      const { deviceID } = req.body;
      console.log(deviceID);
     
      if (!deviceID) {
          return res.send(error(422, "insufficient data"));
      }
     
      const  existingUser = await guestModel.findOne({ deviceID });
     
      if (!existingUser) {
         
          const referralCode = generateUniqueReferralCode();
        
          const newUser = await guestModel.create({deviceID,referralCode});
          console.log(newUser);
          const accessToken = generateAccessToken({ ...newUser })
          return res.send(success(200,{accessToken, isNewUser: true}))
      }

      const accessToken = generateAccessToken({ ...existingUser });
      return res.send(success(200, {accessToken, isNewUser: false}));
  } catch (err) {
    
      return res.send(error(500, err.message));
  }
}

export async function getUserController(req,res){
    try {
        const currUserID = req._id;
        const user = await userModel.findOne({_id:currUserID}).populate('achievements').populate('levels');
        if(!user){
            return res.send(error(404,"user not found"));
        }
        return res.send(success(200,user));
    } catch (err) {
        return res.send(error(500,err.message));
    }
  }
  export async function referAndEarnController(req,res){

        const currUser = req._id;
       
        const{referralCode} = req.body;
        try {
            const refferer = await userModel.findOne({referralCode}); 
            
            if(!refferer){
                return res.send(error(404,"refferer user not found"));
            } 
            const reffered = await userModel.findById({_id:currUser});
            if(!reffered){
                return res.send(error(404,"referred user not found"));
            }
            refferer.coins+=20;
            await refferer.save();
            reffered.coins+=10;
            await reffered.save();
         return res.send(success(200,"you have earn 10 coins by referal successfully "));
            
        } catch (err) {
            return res.send(error(500,err.message));
        }
  }