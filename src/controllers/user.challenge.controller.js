import createChallengeModel from "../models/admin.challenge.model.js";
import challengemodel from "../models/user.challenge.model.js";
import { userModel } from "../models/User.js";
import { success,error } from "../utills/responseWrapper.utill.js";

export async function insertChallengeController(req,res){
    try{
        const user =req._id;
        const {name} = req.body;

        const currUser = await userModel.findById(user)
        if(!currUser){
            return res.send(error(404, 'User Not Found'))
        }
        const existingChallenge = await challengemodel.findOne({name})
        if(existingChallenge){
            await challengemodel.deleteOne({name})
        }
        const challengeDetails = await createChallengeModel.findOne({name})
        if(!challengeDetails){
      return res.send(error(404, 'Challenge Not Found'))
    }
    if (!challengeDetails.isActive){
        return res.send(error(404, 'Challenge is not active'))
    }
    const now = new Date()
    const utcOffset = 5.5 *60 * 60 * 1000;
    const istTime = new Date(stratTime.getTime() + utcOffset)

      const startTime = istTime;
      const endTime = new Date(startTime.getTime() + challengeDetails.duration)

      const challengeInfo = new challengemodel ({user,startTime: startTime,endTime,name})
      const createdChallenge = await challengeInfo.save()

      currUser.challenge.push(createdChallenge._id)
      await currUser.save()

      return res.send(success(200,"Challenge started successfully"))
}catch (error){
    return res.send(error(500,error.message))
}
}

export async function updateChallengeController(req,res){
    try{
        const user = req._id;
        const {name,status} = req.body;
        const currUser = await userModel.findById(user)
        if(!currUser){
            return res.send(error(404,'User not Found'))
        }
        const challengeDetails = await createChallengeModel.findOne({name})
        console.log(challengeDetails)
        const challengeInfo = await challengemodel.findOne({name})
        
        
    if (status === "win"){
        
        currUser.INR += challengeDetails.rewards
        await currUser.save()
    }
    challengeInfo.status = status
    await challengeInfo.save()
    return res.send(success(200,"Challenge Completed successfully"))
    }catch(error){
        return res.send(error(500,error.message))
    }
}

export async function getAllChallengeController(req,res){
   
    try{
        const user =req._id;
        const currUser = await userModel.findById(user)
        if (!currUser){
            return res.send(error(404,'User Does Not Exist'));
        }
        const allChallenges = await challengemodel.find({user}).populate('user')
        if(!allChallenges){
            return res.send(error(404,'User have Not played any challenge yet!'))
        }
        console.log(allChallenges)
        return res.send(success(200,allChallenges))
    }catch(error){
        return res.send(error(500,err.message))
    }
}