import userModel from "../models/User.js";
import { generateAccessToken } from "../services/generateAccessToken.service.js";
import { error, success } from "../utills/responseWrapper.utills.js";
import { generateUniqueReferralCode } from "../services/generateReferalCode.js";

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
export async function authenticLoginController(req,res){
  try {
     
  
      const {deviceID,name,email,profileURL} = req.body;
      if(!name || !email ||!deviceID){
          return res.send(error(422,"insufficient data"));
      }


      const existingUser =  await userModel.findOne({deviceID});
  
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
      if (!deviceID) {
        return res.send(error(422, "Insufficient data"));
      }
  
      // Check if the user already exists in the database
      const existingUser = await userModel.findOne({ deviceID });
  
      // If user not present, create a new guest user
      const referralCode =  generateUniqueReferralCode();
      if (!existingUser) {
        const newUser = new userModel({ deviceID ,referralCode});
        const createdUser = await newUser.save();
        const accessToken = generateAccessToken({ ...createdUser });
        return res.send(success(200, { accessToken, isNewUser: true })); // Indicate that the user is a new user
      }
  
      // If user already present, generate access token and return
      const accessToken = generateAccessToken({ ...existingUser });
      return res.send(success(200, { accessToken, isNewUser: false })); // Indicate that the user is not a new user
  
    } catch (err) {
      return res.send(error(500, err.message));
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