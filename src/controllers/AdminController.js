import adminModel from "../models/Admin.js"
import {userModel} from "../models/User.js";
import bcrypt from 'bcrypt'
import { generateAccessToken } from "../services/generateAccessToken.service.js";
import { error, success } from "../utills/responseWrapper.utills.js";
import createChallengeModel from "../models/admin.challenge.model.js"
import kycModel from "../models/user.kyc.model.js";
import { generateUniqueReferenceId } from "../services/generateRefrenceID.js";
import WithDrawModel from "../models/user.withdraw.model.js";


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
    return res.send(500,err.message);
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
    return res.send(500,err.message)
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
        const kycList = await kycModel.find({})

        return res.send(success(200,kycList,"KYC list Fetched Successfully"))
    }catch(error){
        return res.send(500,error.message)
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
        const userId = req.params.id
        const userDetails = await userModel.findByIdAndUpdate(userId,{$set: {kycstatus :status}})

        if (!userDetails){
            return res.send(error(404,"User Not Found"))
        }
        const kycDetails = await kycModel.findOne({user:userId})
        kycDetails.status = status
        await kycDetails.save()


        return res.send(success(200,"KYC status updated successfully"))
    }catch(error){
        return res.send(500,error.message)
    }
}

export async function getAllWithdrawRequest(req,res){
    try {
        const withdrawRequests = await WithDrawModel.find().populate('user', 'userId,upi_Id,name,mobile_number,accountnumber,IfscCode,amount:parseFloat(amount),mode,status:"pending" '); // Adjust the populate fields as necessary
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
    