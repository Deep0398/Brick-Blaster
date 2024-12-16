import { guestModel } from "../models/User.js";
import { authModel } from "../models/User.js";
import { userModel } from "../models/User.js"
import { facebookModel } from "../models/User.js";
import { generateAccessToken } from "../services/generateAccessToken.service.js";
import { error, success } from "../utills/responseWrapper.utills.js";
import { generateUniqueReferralCode } from "../services/generateReferalCode.js";
import kycModel from "../models/user.kyc.model.js";
import WithDrawModel from "../models/user.withdraw.model.js";

 
// export async function guestLoginController(req, res) {
//     try {
//         const { deviceID } = req.body;
//         console.log(deviceID);
       
//         if (!deviceID) {
//             return res.send(error(422, "insufficient data"));
//         }
       
//         const existingUser = await guestModel.findOne({ deviceID });
       
//         if (existingUser) {
//             // If the existing user is found, delete it
//             await guestModel.deleteOne({ deviceID });
//         }
       
//         const referralCode = generateUniqueReferralCode();
          
//         const newUser = await guestModel.create({ deviceID, referralCode });
//         console.log(newUser);
//         const accessToken = generateAccessToken({ ...newUser })
//         return res.send(success(200, { accessToken, isNewUser: true }));
        
//     } catch (err) {
//         return res.send(error(500, err.message));
//     }
// }

export async function guestLoginController(req, res) {
    try {
      const { deviceID } = req.body;
      console.log(deviceID);
  
      if (!deviceID) {
        return res.send(error(422, "insufficient data"));
      }
  
      const existingUser = await guestModel.findOne({ deviceID });
  
      if (existingUser) {
        // If the existing user is found, delete it
        await guestModel.deleteOne({ deviceID });
      }
  
      const referralCode = generateUniqueReferralCode();
  
      const newUser = await guestModel.create({ deviceID, referralCode });
      console.log(newUser);
  
      const userDetails = await userModel
        .findOne({ _id: newUser._id })
        .populate("achievements")
        .populate("levels");
      if (!userDetails) {
        return res.status(404).send({ message: "User details not found" });
      }
      const accessToken = generateAccessToken({ ...userDetails });
      return res.send(
        success(200, { accessToken, user: userDetails, isNewUser: true })
      );
    } catch (err) {
      return res.send(error(500, err.message));
    }
  }

//   export async function authenticLoginController(req, res) {
//     try {
//         const { email, deviceID ,name} = req.body;
//         if (!email || !deviceID || !name) {
//             return res.send(error(422, "insufficient data"));
//         }
    
//         // Find existing user with the same email
//         const guestUser = await guestModel.findOne({ deviceID });
        
//         const existingUser = await authModel.findOne({ email });
        
//         if (!existingUser) {
            
//             // Generate referral code only for new users
//             const referralCode = generateUniqueReferralCode();
//             const newUser = new authModel({ email,name, referralCode });

//             // Transfer guest user data to authenticated user
//             if (guestUser) {
//                 newUser.Balls = guestUser.Balls; // Assuming name is a field you want to transfer
//                 newUser.coins = guestUser.coins;
//                 newUser.powerups1 = guestUser.powerups1;
//                 newUser.powerups2 = guestUser.powerups2;
//                 newUser.powerups3 = guestUser.powerups3;
//                 newUser.levels = guestUser.levels;
//                 newUser.achievements = guestUser.achievements;
                 
//             }

//             await newUser.save();

//             // Delete guest user
//             if (guestUser) {
//                 await guestModel.deleteOne({ _id: guestUser._id });
//             }

//             const accessToken = generateAccessToken({ ...newUser });
//             return res.send(success(200, { accessToken, isNewUser: true }));
//         } 

//         const accessToken = generateAccessToken({ ...existingUser });
//         return res.send(success(200, { accessToken, isNewUser: false }));

//     } catch (err) {
//         return res.send(error(500, err.message));
//     }
// }
export async function authenticLoginController(req, res) {
    try {
      const { email, deviceID, name } = req.body;
      if (!email || !deviceID || !name) {
        return res.send(error(422, "Insufficient data"));
      }
  
      // Find guest user based on deviceID
      const guestUser = await guestModel.findOne({ deviceID });
  
      // Check if the user already exists
      const existingUser = await authModel.findOne({ email });
  
      if (!existingUser) {
        // Generate referral code for new users
        const referralCode = generateUniqueReferralCode();
        const newUser = new authModel({ email, name, referralCode });
  
        // Transfer guest data to the authenticated user
        if (guestUser) {
          Object.assign(newUser, {
            life: guestUser.life,
            coins: guestUser.coins,
            ExtraMoves: guestUser.ExtraMoves,
            Packages: guestUser.Packages,
            Stripes: guestUser.Stripes,
            ExtraTime: guestUser.ExtraTime,
            Bomb: guestUser.Bomb,
            Colorful_bomb: guestUser.Colorful_bomb,
            Hand: guestUser.Hand,
            Random_color: guestUser.Random_color,
            levels: guestUser.levels,
          });
  
          await guestModel.deleteOne({ _id: guestUser._id });
        }
  
        await newUser.save();
  
        const accessToken = generateAccessToken(newUser.toObject());
  
        return res.status(200).send(
          success(200, {
            accessToken,
            user: newUser,
            isNewUser: true,
          })
        );
      }
  
      // If user exists, ensure deviceID is associated
      if (!existingUser.deviceIDs) {
        existingUser.deviceIDs = [];
      }
      if (!existingUser.deviceIDs.includes(deviceID)) {
        existingUser.deviceIDs.push(deviceID);
        await existingUser.save();
      }
  
      const accessToken = generateAccessToken(existingUser.toObject());
  
      return res.status(200).send(
        success(200, {
          accessToken,
          user: existingUser,
          isNewUser: false,
        })
      );
    } catch (err) {
      return res.status(500).send(error(500, err.message));
    }
  }
// export async function facebookLoginController(req, res) {
//     try {
//         const { facebookID, deviceID,name } = req.body;
//         if (!facebookID && !deviceID ) {
//             return res.send(error(422, "insufficient data"));
//         }
    
//         // Find existing user with the same email
//         const guestUser = await guestModel.findOne({ deviceID });
        
//         var existingUser;
//         if(facebookID){
//              existingUser = await facebookModel.findOne({ facebookID });
//         }
       

        
//         if (!existingUser) {
            
//             // Generate referral code only for new users
//             const referralCode = generateUniqueReferralCode();
//             const newUser = new facebookModel({  
//                 referralCode,
//                 facebookID ,
//                 name
               
//             });
            

//              // Transfer guest user data to authenticated user
//              if (guestUser) {
//                 newUser.Balls = guestUser.Balls; // Assuming name is a field you want to transfer
//                 newUser.coins = guestUser.coins;
//                 newUser.powerups1 = guestUser.powerups1;
//                 newUser.powerups2 = guestUser.powerups2;
//                 newUser.powerups3 = guestUser.powerups3;
//                 newUser.levels = guestUser.levels;
//                 newUser.achievements = guestUser.achievements;
                 
//             }

//             await newUser.save();

//             // Delete guest user
//             if (guestUser) {
//                 await guestModel.deleteOne({ _id: guestUser._id });
//             }

//             const accessToken = generateAccessToken({ ...newUser });
//             return res.send(success(200, { accessToken, isNewUser: true }));
//         } 

//         const accessToken = generateAccessToken({ ...existingUser });
//         return res.send(success(200, { accessToken, isNewUser: false }));

//     } catch (err) {
//         return res.send(error(500, err.message));
//     }
// }

export async function facebookLoginController(req, res) {
    try {
      const { facebookID, deviceID, fcmToken, name, shortLivedToken } = req.body;
      console.log("Received request:", { facebookID, deviceID, fcmToken, name });
  
      if (!facebookID && !deviceID) {
        return res.status(422).send(error("Insufficient data provided"));
      }
  
      const guestUser = await guestModel.findOne({ deviceID });
  
      let existingUser = facebookID
        ? await facebookModel.findOne({ facebookID })
        : null;
  
      if (!existingUser) {
        const referralCode = generateUniqueReferralCode();
        const newUser = new facebookModel({
          referralCode,
          facebookID,
          name,
          fcmToken: fcmToken ? [fcmToken] : [],
        });
  
        if (guestUser) {
          Object.assign(newUser, {
            life: guestUser.life,
            coins: guestUser.coins,
            ExtraMoves: guestUser.ExtraMoves,
            Packages: guestUser.Packages,
            Stripes: guestUser.Stripes,
            ExtraTime: guestUser.ExtraTime,
            Bomb: guestUser.Bomb,
            Colorful_bomb: guestUser.Colorful_bomb,
            Hand: guestUser.Hand,
            Random_color: guestUser.Random_color,
            levels: guestUser.levels,
          });
  
          await guestModel.deleteOne({ _id: guestUser._id });
        }
  
        const longLivedToken = await getLongLivedAccessToken(shortLivedToken);
        if (!longLivedToken) {
          return res
            .status(500)
            .send(error("Failed to obtain Facebook access token"));
        }
        const friendsList = await fetchFacebookFriends(
          facebookID,
          longLivedToken
        );
        newUser.friends = friendsList;
  
        await newUser.save();
  
        const accessToken = generateAccessToken(newUser);
  
        return res
          .status(200)
          .send(success({ accessToken, user: newUser, isNewUser: true }));
      }
  
      if (fcmToken && !existingUser.fcmToken.includes(fcmToken)) {
        existingUser.fcmToken.push(fcmToken);
        await existingUser.save();
      }
  
      const accessToken = generateAccessToken(existingUser.toObject());
  
      return res.send(
        success(200, { accessToken, user: existingUser, isNewUser: false })
      );
    } catch (err) {
      return res.status(500).send(error(err.message));
    }
  }


// export async function getUserController(req,res){
//     try {
//         const currUserID = req._id;
//         const user = await userModel.findOne({_id:currUserID}).populate('achievements').populate('levels');
//         if(!user){
//             return res.send(error(404,"user not found"));
//         }
//         return res.send(success(200,user));
//     } catch (err) {
//         return res.send(error(500,err.message));
//     }
//   }

export async function getUserController(req, res) {
    try {
      console.log("Request params:", req.params); // Debugging step
      const userId = req.params.id; // Get the 'id' from the route
  
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
  
      const user = await userModel
        .findOne({ _id: userId })
        .populate("Levels")
        .populate({
          path: "friends", // Populate the friends field with details
          select: "facebookID", // Only select the facebookID field for friends
        });
  
      if (!user) {
        return res.status(404).json({ error: "User not found!" });
      }
  
      return res.status(200).json({ success: true, data: user });
    } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Internal server error", details: err.message });
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
        referred.isReferUsed = true;
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

export async function getdetailController(req, res) {
    try {
        
        const totalUsers = await userModel.countDocuments();
        const zeroCount = await userModel.countDocuments({ __v: 0 });
        const oneCount = await userModel.countDocuments({ __v: 1 });
        const twoCount = await userModel.countDocuments({ __v: 2 });
        const threeCount = await userModel.countDocuments({ __v: 3 });
        const fourCount = await userModel.countDocuments({ __v: 4 });
        const fiveCount = await userModel.countDocuments({ __v: 5});
        const sixCount = await userModel.countDocuments({ __v: 6 });
        const sevenCount = await userModel.countDocuments({ __v: 7 });
        const eightCount = await userModel.countDocuments({ __v: 8});
        const nineCount = await userModel.countDocuments({ __v: 9 });
        const tenCount = await userModel.countDocuments({ __v: 10});
        const elevenCount = await userModel.countDocuments({ __v: 11 });
        const twelveCount = await userModel.countDocuments({ __v: 12 });
        const thirteenCount = await userModel.countDocuments({ __v: 13 });
        const fourteenCount = await userModel.countDocuments({ __v: 14 });
        const fifteenCount = await userModel.countDocuments({ __v: 15 });
        const sixteenCount = await userModel.countDocuments({ __v: 16 });
        const seventeenCount = await userModel.countDocuments({ __v: 17 });
        const eighteenCount = await userModel.countDocuments({ __v: 18 });
        const ninteenCount = await userModel.countDocuments({ __v: 19 });
        const twentyCount = await userModel.countDocuments({ __v: 20 });
        const twentyoneCount = await userModel.countDocuments({ __v:21});
        const twentytwoCount = await userModel.countDocuments({ __v: 22});
        const twentythreeCount = await userModel.countDocuments({ __v: 23 });
        const  twentyfourCount = await userModel.countDocuments({ __v: 24 });
        const  twentyfiveCount = await userModel.countDocuments({ __v: 25 });
        const  twentysixCount = await userModel.countDocuments({ __v: 26});
        const  twentysevenCount = await userModel.countDocuments({ __v: 27 });
        const  twentyeightCount = await userModel.countDocuments({ __v: 28 });
        const twentynineCount = await userModel.countDocuments({ __v: 29 });
        const  thirtyCount = await userModel.countDocuments({ __v: 30 });
        const thirtyoneCount = await userModel.countDocuments({ __v: 31 });
        const thirtytwoCount = await userModel.countDocuments({ __v: 32});
        const thirtythreeCount = await userModel.countDocuments({ __v: 33 });
        const thirtyfourCount = await userModel.countDocuments({ __v: 34 });
        const  thirtyfiveCount = await userModel.countDocuments({ __v: 35 });
        const thirtysixCount = await userModel.countDocuments({ __v: 36 });
        const thirtysevenCount = await userModel.countDocuments({ __v: 37 });
        const thirtyeightCount = await userModel.countDocuments({ __v: 38});
        const thirtynineCount = await userModel.countDocuments({ __v: 39 });
        const fourtyCount = await userModel.countDocuments({ __v: 40 });
        const fourtyoneCount = await userModel.countDocuments({ __v: 41 });
        const fourtytwoCount = await userModel.countDocuments({ __v: 42 });
        const fourtythreeCount = await userModel.countDocuments({ __v: 43 });
        const fourtyfourCount = await userModel.countDocuments({ __v: 44 });
        const fourtyfiveCount = await userModel.countDocuments({ __v: 45 });
        const fourtysixCount = await userModel.countDocuments({ __v: 46 });
        const fourtysevenCount = await userModel.countDocuments({ __v: 47});
        const fourtyeightCount = await userModel.countDocuments({ __v: 48 });
        const fourtynineCount = await userModel.countDocuments({ __v: 49});
        const fiftyCount = await userModel.countDocuments({ __v: 50 });
        

        return res.send( {
            totalUsers,
            zeroCount ,
            oneCount ,
           twoCount ,
            threeCount,
            fourCount,
            fiveCount ,
            sixCount,
            sevenCount ,
           eightCount ,
            nineCount ,
           tenCount,
         elevenCount,
           twelveCount ,
           thirteenCount ,
        fourteenCount ,
            fifteenCount,
        sixteenCount ,
          seventeenCount ,
          eighteenCount, 
           ninteenCount,
            twentyCount ,
          twentyoneCount ,
        twentytwoCount ,
           twentythreeCount ,
             twentyfourCount,
         twentyfiveCount,
             twentysixCount,
            twentysevenCount ,
           twentyeightCount ,
            twentynineCount ,
             thirtyCount ,
            thirtyoneCount ,
           thirtytwoCount,
           thirtythreeCount,
            thirtyfourCount ,
             thirtyfiveCount ,
           thirtysixCount ,
            thirtysevenCount,
          thirtyeightCount,
           thirtynineCount ,
            fourtyCount ,
            fourtyoneCount ,
           fourtytwoCount ,
           fourtythreeCount ,
            fourtyfourCount ,
            fourtyfiveCount ,
           fourtysixCount ,
            fourtysevenCount, 
            fourtyeightCount ,
            fourtynineCount, 
           fiftyCount 
           
         
        
        
        });
    } catch (err) {
        return res.send(error(500, err.message));
    }
}

export async function kycController (req,res){
    try{
         const userId  = req._id
         if(!userId){
            return res.send(error(404,"User Not Found"))
         }
         const userINRBalance = await getUserINRBalance(userId);
        const minimumINRBalance = 50; // Minimum INR balance required for KYC completion

        if (userINRBalance < minimumINRBalance) {
            return res.status(400).send({
                message: "Dear User! Minimum 50 Rs. Earning required for KYC completion"
            });
        }
        const existingKYC = await kycModel.findOne({ user: userId });
        if (existingKYC) {
            await kycModel.findByIdAndDelete(existingKYC._id);
        }
    const {firstName,lastName,adharNumber,panNumber} = req.body ;
console.log(req.body)
    if( !firstName || !lastName || !adharNumber || !panNumber  ){
        return res.status (400).send({error: "Please Fill all the details"})
    }
    const adharFront =  req.files['adharFront'][0];
    const adharBack =  req.files['adharBack'][0];
    const panFront =  req.files['panFront'][0];

    console.log(adharFront,adharBack,panFront);

    if (!adharFront || !adharBack || !panFront){
        return res.status (400).send({error: "Please Upload all the images"})
    }
    const adharFrontPath = adharFront.path
    const adharBackPath = adharBack.path
    const panFrontPath = panFront.path

    console.log(adharFrontPath,adharBackPath,panFrontPath)

    const kycDetails = new kycModel ({
        firstName,
        lastName,
        adharNumber,
        panNumber,
         adharFront : adharFrontPath,
       adharBack : adharBackPath,
        panFront : panFrontPath,
         user: userId,
         status:0
    })
    await kycDetails.save();
   

    const userDetails = await userModel.findById(userId);
    if (userDetails) {
        userDetails.kycstatus = 0;
        await userDetails.save();
    }

    return res.send(success(200,"KYC details saved successfully"))
}catch(error){
    console.log(error)
    return res.status(500).send({message:"Internal Server Error"})
}
}

export async function withdrawcontroller(req,res){
    try {
      const {userId,upi_Id,name,mobile_number,accountnumber,amount,IfscCode} = req.body
      
     if(!upi_Id && (!accountnumber || !IfscCode)){
      return res.status(400).send({message:"Please provide any one mode of payment"})
     }
     if(!name || !mobile_number){
      return res.status(400).send({message:"Please provide contact details"})
     }
     const user = await userModel.findById(userId);
     if(!user){
      return res.status(404).send({message:"User not found"})
     }
     if(user.kycstatus !==1){
      return res.status(403).send({message:"Please Complete your KYC first"})
     }
     if(user.INR < amount){
      return res.status(400).send({message:"Insuffiecent Funds"})
     }
     const mode = upi_Id ? "UPI" :"NEFT"
  
     const withdrawDetails = new WithDrawModel({user: userId,upi_Id,name,mobile_number,accountnumber,IfscCode,amount:parseFloat(amount),mode,status:"pending"})
     await withdrawDetails.save()
  
     user.INR -= parseFloat(amount)
     await user.save()
  
     res.status(201).json({ message: 'Withdrawal request received and pending admin approval' });
    } catch (error) {
        console.error('Error processing withdrawal:', error.message);
        res.status(500).json({ error: error.message });
    }
  }
  export async function updateInrController(req,res){
    try{
        const userID = req._id;
        const {inrIncrease} = req.body;

        if(  !inrIncrease){
            return res.send(error(400," Fill all the details"));
        }  
        const user = await userModel.findById(userID);
        if(!user){
            return res.send(error(404,"user not found"));
        }
        
    user.INR += inrIncrease;
    await user.save();

    return res.send(success(200,{message:"INR updated Sucessfully"}));
    } catch (err) {
        return res.send(error(500,err.message));
    
   }

}
async function getUserINRBalance(userId) {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user.INR; // Return the INR amount directly
    } catch (error) {
        throw error;
    }
}

export async function deleteUserController(req,res){
    try{
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.send(error(404, "User not found"));
        }
        return res.send(success(200, "User deleted successfully"));
    }catch (err) {
        console.log(err)
            return res.send(error(500, err.message));
        }
}

export async function addUserFriends(req, res) {
    try {
      const { facebookID, friendsList } = req.body;
  
      if (!facebookID || !Array.isArray(friendsList)) {
        return res.status(400).json({
          error: "Invalid input. facebookID and friendsList are required.",
        });
      }
  
      // Find the user's existing friends
      const user = await facebookModel.findOne({ facebookID }, "friends");
      const existingFriends = user ? user.friends : [];
  
      // Filter out friends that are already in the user's friends list
      const newFriendsList = friendsList.filter(
        (friendID) => !existingFriends.includes(friendID)
      );
  
      if (!newFriendsList.length) {
        return res
          .status(400)
          .json({ error: "All friends in the list are already added." });
      }
  
      // Validate the new friends by checking if they exist in the database
      const validFriends = await facebookModel.find(
        { facebookID: { $in: newFriendsList } },
        "facebookID"
      );
  
      if (!validFriends.length) {
        return res.status(400).json({ error: "No valid friends found to add." });
      }
  
      const validFriendsIDs = validFriends.map((friend) => friend.facebookID);
  
      // Update the user's friends list
      const updatedUser = await facebookModel.findOneAndUpdate(
        { facebookID },
        {
          $addToSet: { friends: { $each: validFriendsIDs } }, // Add valid facebookIDs to the friends list
          $setOnInsert: { referralCode: `REF-${Date.now()}` }, // Set referral code if the user is newly inserted
        },
        { new: true, upsert: true }
      );
  
      res.status(200).json({
        message: "Friends added successfully",
        newFriends: validFriendsIDs,
      });
    } catch (err) {
      console.error("Error adding friends:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }