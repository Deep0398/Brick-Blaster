import { guestModel } from "../models/User.js";
import { authModel } from "../models/User.js";
import { userModel } from "../models/User.js"
import { facebookModel } from "../models/User.js";
import { generateAccessToken } from "../services/generateAccessToken.service.js";
import { error, success } from "../utills/responseWrapper.utills.js";
import { generateUniqueReferralCode } from "../services/generateReferalCode.js";

 
export async function guestLoginController(req, res) {
    try {
        const { deviceID } = req.body;
       
       
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
  
  export async function authenticLoginController(req, res) {
    try {
        const { email, deviceID ,name} = req.body;
        if (!email || !deviceID || !name) {
            return res.send(error(422, "insufficient data"));
        }
    
        // Find existing user with the same email
        const guestUser = await guestModel.findOne({ deviceID });
        
        const existingUser = await authModel.findOne({ email });
        
        if (!existingUser) {
            
            // Generate referral code only for new users
            const referralCode = generateUniqueReferralCode();
            const newUser = new authModel({ email,name, referralCode });

            // Transfer guest user data to authenticated user
            if (guestUser) {
                newUser.Balls = guestUser.Balls; // Assuming name is a field you want to transfer
                newUser.coins = guestUser.coins;
                newUser.powerups1 = guestUser.powerups1;
                newUser.powerups2 = guestUser.powerups2;
                newUser.powerups3 = guestUser.powerups3;
                newUser.levels = guestUser.levels;
                newUser.achievements = guestUser.achievements;
                 
            }

            await newUser.save();

            // Delete guest user
            if (guestUser) {
                await guestModel.deleteOne({ _id: guestUser._id });
            }

            const accessToken = generateAccessToken({ ...newUser });
            return res.send(success(200, { accessToken, isNewUser: true }));
        } 

        const accessToken = generateAccessToken({ ...existingUser });
        return res.send(success(200, { accessToken, isNewUser: false }));

    } catch (err) {
        return res.send(error(500, err.message));
    }
}
export async function facebookLoginController(req, res) {
    try {
        const { facebookID, deviceID } = req.body;
        if (!facebookID && !deviceID ) {
            return res.send(error(422, "insufficient data"));
        }
    
        // Find existing user with the same email
        const guestUser = await guestModel.findOne({ deviceID });
        
        var existingUser;
        if(facebookID){
             existingUser = await facebookModel.findOne({ facebookID });
        }
       

        
        if (!existingUser) {
            
            // Generate referral code only for new users
            const referralCode = generateUniqueReferralCode();
            const newUser = new facebookModel({  
                referralCode,
                facebookID 
               
            });
            

             // Transfer guest user data to authenticated user
             if (guestUser) {
                newUser.Balls = guestUser.Balls; // Assuming name is a field you want to transfer
                newUser.coins = guestUser.coins;
                newUser.powerups1 = guestUser.powerups1;
                newUser.powerups2 = guestUser.powerups2;
                newUser.powerups3 = guestUser.powerups3;
                newUser.levels = guestUser.levels;
                newUser.achievements = guestUser.achievements;
                 
            }

            await newUser.save();

            // Delete guest user
            if (guestUser) {
                await guestModel.deleteOne({ _id: guestUser._id });
            }

            const accessToken = generateAccessToken({ ...newUser });
            return res.send(success(200, { accessToken, isNewUser: true }));
        } 

        const accessToken = generateAccessToken({ ...existingUser });
        return res.send(success(200, { accessToken, isNewUser: false }));

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
 
  export async function referAndEarnController(req, res) {
    const currUser = req._id;
    const { referralCode } = req.body;
    try {
        const referrer = await userModel.findOne({ referralCode });
        if (!referrer) {
            return res.send(error(404, "referrer user not found"));
        }

        const referred = await userModel.findById(currUser);

        if (!referred) {
            return res.send(error(404, "referred user not found"));
        }

        // Store the original referral code of both referrer and referred
        const originalReferralCodeReferrer = referrer.referralCode;
        const originalReferralCodeReferred = referred.referralCode;

        // Perform the referral and earn operations
        referrer.coins += 20;
        // console.log(referrer);
        referrer.referedCount++;
        await referrer.save();

        referred.coins += 10;
        await referred.save();

        // Restore the original referral codes
        referrer.referralCode = originalReferralCodeReferrer;
        referrer.isReferred = true;
        await referrer.save();

        referred.referralCode = originalReferralCodeReferred;
        await referred.save();

        return res.send(success(200, {isReferred:true}));

    } catch (err) {
        return res.send(error(500, err.message));
    }
}
  export async function getUnlockLevels(req,res){
    try {
        const id = req._id;
        const user = await userModel.findById(id);
        const unlockLevelcount = user?.levels?.length;
        return res.send(success(200,{unlockLevelcount}));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}