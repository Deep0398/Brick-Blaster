import adminModel from "../models/Admin.js"
import {userModel} from "../models/User.js";
import bcrypt from 'bcrypt'
import { generateAccessToken } from "../services/generateAccessToken.service.js";
import { error, success } from "../utills/responseWrapper.utills.js";
import createChallengeModel from "../models/admin.challenge.model.js"
import kycModel from "../models/user.kyc.model.js";
import { generateUniqueReferenceId } from "../services/generateRefrenceID.js";
import WithDrawModel from "../models/user.withdraw.model.js";
import urlJoin from "url-join";

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
        const {usernameOrEmail,password} = req.body;
        const user = await adminModel.findOne({
            $or:[{username:usernameOrEmail}, {email:usernameOrEmail}]
        }); 
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        const matched = await bcrypt.compare(password,user.password);
        if(!matched){
            return res.send({message:"incorrect password"});
        }

        const accessToken = generateAccessToken({...user})
        // const {_id,password,newuser} = user;
        delete user['_doc']['password'];
        delete user['_doc']['__v'];
        delete user._doc['_id'];
        // console.log(user);

        return res.send({...user._doc,"accessToken":accessToken});
        
    } catch (error) {
        return res.json({"error":error.message});
    }
}

export async function getAllUsersController(req,res){
  try {
      const users = await userModel.find({}).populate('achievements').populate('levels');
      return res.send(success(200,users));
  } catch (err) {
      return res.send(500,err.message);
  }
}

export async function deleteAllUsers(req,res){
    try {
        await userModel.deleteMany({});
        return res.send(success(200,"all users deleted successfully"))
    } catch (err) {
        return res.send (500,err.message);
    }
}

export async function createChallengeController(req,res){
    const {name,description,isActive,rewards,duration,challengetype,taskamount} = req.body
    try{
   if(!name || !description || !rewards || !duration || !challengetype || !taskamount){
        return res.send(404,"Insufficient Data")
    }

    const referenceId = generateUniqueReferenceId()

    const newChallenge = new createChallengeModel ({
        referenceId,
        name, 
        description,
        isActive:isActive || true,
        rewards,
        duration,
        challengetype,
        taskamount
    })

    const savedChallenge = await newChallenge.save()

    return res.send(success(200,savedChallenge,"challenge created successfully",savedChallenge))
}catch (error){
    return res.status(500).send(err.message)
}
}

export async function getChallengeController(req,res){
    try{

        const challengeDetails = await createChallengeModel.find({})

        if(!challengeDetails){
            return res.send(error(404,"challenge not found"))
        }
        return res.send(success(200,challengeDetails,"challenge fetched successfully",challengeDetails))
    }catch(error){
        return res.send(500,error.message)
    }
}

export async function updateChallengeController(req,res){
 
    const {id} = req.params
    const {name,description,isActive,rewards,duration,challengetype,taskamount} = req.body
    try {
      const existingChallenge = await createChallengeModel.findById(id)

      if(!existingChallenge){
        return res.send(error(404,error.message))
      }
      if(name){
        existingChallenge.name = name;
      }
      if (description){
        existingChallenge.description = description;
      }
      if (isActive != undefined){
        existingChallenge.isActive = isActive;
      }
      if (rewards){
        existingChallenge.rewards = rewards;
      }
      if(duration){
        existingChallenge.duration = duration;
      }
      if(taskamount){
        existingChallenge.taskamount = taskamount;
      }
      if(challengetype){
        existingChallenge.challengetype = challengetype;
      }

      const updatedChallenge = await existingChallenge.save()

      return res.send(success(200,updatedChallenge,"challenge updated successfully",updatedChallenge))
    }catch(error){
        return res.send(error(500,err.message))
    }
}

export async function deleteChallengeController(req,res){
    try{
        const {id} = req.params
        await createChallengeModel.findByIdAndUpdate(id)
        return res.send(success(200,"challenge deleted successfully"))
    }catch(err){
        return res.send(500,err.message)
    }

}

export async function getKycController(req,res){
    try{
        const admin = req._id;
        const adminDetail = await adminModel.findById({_id:admin})
        if(!adminDetail){
            return res.send(error(404,"Admin not found"))
        }
        const kycList = await kycModel.find({}).lean();
        const baseURL = process.env.BASE_URL;
        
    
        if (!baseURL) {
            console.error("BASE_URL is not defined in environment variables");
            return res.status(500).json({ message: "Server configuration error" });
        }
    
        const formattedKycList = kycList.map(kyc => {
            if (kyc.adharFront) console.log("AdharFront:", kyc.adharFront);
            if (kyc.adharBack) console.log("AdharBack:", kyc.adharBack);
            if (kyc.panFront) console.log("PanFront:", kyc.panFront);
    
            return {
                _id: kyc._id,
                user:kyc.user,
                firstName: kyc.firstName,
                lastName: kyc.lastName,
                adharNumber:kyc.adharNumber,
                panNumber:kyc.panNumber,
                adharFront: kyc.adharFront ? urlJoin(baseURL, kyc.adharFront.replace(/\\/g, '/')) : null,
                adharBack: kyc.adharBack ? urlJoin(baseURL, kyc.adharBack.replace(/\\/g, '/')) : null,
                panFront: kyc.panFront ? urlJoin(baseURL, kyc.panFront.replace(/\\/g, '/')) : null,
                status: kyc.status,
                createdAt: kyc.createdAt,
                updatedAt: kyc.updatedAt
            };
        });
    
        return res.status(200).json({ message: "KYC list fetched successfully", data: formattedKycList });
    } catch (err) {
        console.error("Error in getKycListController:", err);
        return res.status(500).json({ message: err.message });
    }
    }

export async function updateKycStatusContoller(req,res){
    try{
        const admin = req._id
        const adminDetail = await adminModel.findById({_id:admin})
        if(!adminDetail){
            return res.send(error(404,"Admin not found"))
        }
        const {status} = req.body
        const { userId } = req.params;
        console.log("User ID from params:", userId);
        console.log("Status from body:", status);

        if (!status || !userId) {
            console.log("Missing status or user ID");
            return res.status(400).json({ message: "Missing status or user ID" });
        }

        const userDetails = await userModel.findById(userId);
        console.log("User Details:", userDetails);

        if (!userDetails) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        userDetails.kycstatus = status;
        await userDetails.save();

        const kycDetails = await kycModel.findOne({ user: userId });
        console.log("KYC Details:", kycDetails);

        if (!kycDetails) {
            console.log("KYC details not found for this user");
            return res.status(404).json({ message: "KYC details not found for this user" });
        }

        kycDetails.status = status;
        await kycDetails.save();

        let message ;
        if (status === 1) {
            message = "KYC request approved successfully";
        } else if (status === 2) {
            message = "KYC request rejected";
        } else {
            message = "KYC status updated successfully";
        }

        
        return res.status(200).json({ message });

    } catch (err) {
        console.error("Error in updateKycStatusController:", err);
        return res.status(500).json({ message: err.message });
    }
}


export async function getAllWithdrawRequest(req,res){
    try {
        const adminId = req._id;
        const adminDetail = await adminModel.findById(adminId);

        if (!adminDetail) {
            return res.status(404).json({ message: "Unauthorized access" });
        }
        console.log(adminDetail)

        const withdrawRequests = await WithDrawModel.find()
            .populate('user', 'name email'); // Adjust the populated fields as necessary

        res.status(200).json(withdrawRequests);
    } catch (error) {
        console.error('Error retrieving withdrawal requests:', error.message);
        res.status(500).json({ error: error.message });
    }
}
    export async function getWithdrawRequestsByUserId(req, res) {
        try {
            const { userId } = req.params;
            const withdrawRequests = await WithDrawModel.find({ user: userId }).populate('user', 'userId,upi_Id,name,mobile_number,accountnumber,IfscCode,amount:parseFloat(amount),mode,status:"pending" ');
            if (withdrawRequests.length === 0) {
                return res.status(404).json({ message: 'No withdrawal requests found for this user' });
            }
            res.status(200).json(withdrawRequests);
        } catch (error) {
            console.error('Error retrieving withdrawal requests by user ID:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    export async function updateWithdrawRequestStatus(req, res) {
        try {
            const { requestId } = req.params;
            const { status } = req.body;

            if (!['approved', 'rejected'].includes(status)) {
                return res.status(400).json({ message: "Invalid status. Status must be 'approved' or 'rejected'." });
            }
    
            const withdrawRequest = await WithDrawModel.findById(requestId);
            if (!withdrawRequest) {
                return res.status(404).json({ message: "Withdrawal request not found" });
            }
    
            withdrawRequest.status = status;
            await withdrawRequest.save();
    
            // If the status is 'rejected', re-deposit the amount into user's INR balance
            if (status === 'rejected') {
                const user = await userModel.findById(withdrawRequest.user);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                user.INR += withdrawRequest.amount;
                await user.save();
            }
    
            res.status(200).json({ message: `Withdrawal request ${status} successfully` });
        } catch (error) {
            console.error('Error updating withdrawal request status:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    