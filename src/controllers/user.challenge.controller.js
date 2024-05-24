import createChallengeModel from "../models/admin.challenge.model.js";
import challengemodel from "../models/user.challenge.model.js";
import { userModel } from "../models/User.js";
import { success,error } from "../utills/responseWrapper.utills.js";
import CompletedChallenge from "../models/completedChallenge.js";
export async function insertChallengeController(req,res){
    try{
        const user =req._id;
        const {name} = req.body;

        const currUser = await userModel.findById(user)
        if(!currUser){
            return  res.status(500).send({message:"User not found"});
        }

        const activeChallenge = await challengemodel.findOne({user,status:"incomplete"})
        if(activeChallenge){
          return res.status(400).send(400,'You already have a active challenge.Complete it before starting New One' )
        }

        const challengeDetails = await createChallengeModel.findOne({name})
        if(!challengeDetails){
      return res.status(404).send(404, 'Challenge Not Found')
    }
    if (!challengeDetails.isActive){
        return res.status(404).send(404, 'Challenge is not active')
    }
    
    const utcOffset = 5.5 * 60 * 60 * 1000;
        const startTime = new Date(Date.now() + utcOffset);
        const endTime = new Date(startTime.getTime() + challengeDetails.duration);

        const challengeInfo = new challengemodel({
            user, 
            startTime: startTime,
            endTime,
            name,
            taskamount: challengeDetails.taskamount,
            rewards: challengeDetails.rewards,
            duration: challengeDetails.duration,
            status: "incomplete",
            referenceId:challengeDetails.referenceId
            });
        const createdChallenge = await challengeInfo.save();

        if(!currUser.challenge){
            currUser.challenge = [];
        }

      currUser.challenge.push({ challengeId: createdChallenge._id, referenceId: challengeDetails.referenceId});
      await currUser.save()

      const response = {
        _id: createdChallenge._id,
        name: createdChallenge.name,
        startTime: createdChallenge.startTime,
        status: createdChallenge.status,
        user: createdChallenge.user,
        duration:createdChallenge.duration,
        taskamount:createdChallenge.taskamount,
        referenceId: challengeDetails.referenceId
    };


      return res.send(success(200,"Challenge started successfully",response))
}catch (error){
    return res.status(500).send(500,error.message)
}
}

export async function updateChallengeController(req,res){
    try{
        const user = req._id;
        const {name,status} = req.body;
        const currUser = await userModel.findById(user)
        if(!currUser){
            return res.status(404).send(404,'User not Found')
        }
        const challengeDetails = await createChallengeModel.findOne({name})
        console.log(challengeDetails)
        const challengeInfo = await challengemodel.findOne({name,user})
        if(!challengeInfo){
            return res.status(404).send(404, 'Challenge Not Found')
        }

        const existingChallenge = await challengemodel.findOne({name,user})
        if(!existingChallenge){
            return res.status(404).send(404, 'No challenge found for this user')
        }
        
    if (status === "complete" && challengeInfo.status === "complete"){
        
        currUser.INR += challengeDetails.rewards
        //currUser.challenges = currUser.challenges.filter(challengeId => challengeId.toString() !==challengeInfo._id.toString())
        await currUser.save()
    
   const completedChallenge = new CompletedChallenge({
    user:user,
    challenge:challengeInfo._id,
    status:status,
    referenceId:challengeInfo.referenceId
   })
   await completedChallenge.save()
    }
    existingChallenge.status = status
    await existingChallenge.save();

   await challengemodel.findOneAndDelete({name,user})
  
    return res.send(success(200,"Challenge Completed successfully"))
    }catch(error){
        return res.status(500).send(500,error.message)
    }
}

export async function getAllChallengeController(req,res){
   
    try{
        const user =req._id;
        const currUser = await userModel.findById(user)
        if (!currUser){
            return res.status(404).send(404,'User Does Not Exist');
        }

        const completedChallenges = await challengemodel.find({user})

        const ongoingChallenges = await challengemodel.find({user, remainingTime:{$gt: 0}})

        const allChallenges = [...completedChallenges,...ongoingChallenges]

      if(allChallenges.length === 0) {
        return res.status(404).send(404,"no challenge have been played by you");
      }

      const challengesResponse = allChallenges.map(challenge => {
        return {
            _id: challenge._id,
            name: challenge.name,
            startTime: challenge.startTime,
            remainingTime: challenge.remainingTime,
            status: challenge.status,
            rewards: challenge.rewards,
            duration: challenge.duration,
            taskamount:challenge.taskamount,
            referenceId:challenge.referenceId
            
        };
    })
    console.log(challengesResponse)

        console.log(allChallenges)
        return res.send(success(200,allChallenges))
    }catch(error){
        return res.status(500).send(500,err.message)
    }
}

export async function getCompletedChallengesController(req,res){
    try {
      const user = req._id
  
      const completedchallenges = await CompletedChallenge.find({user,status:'complete'}).populate('challenge')
  
      if(completedchallenges.length ===0){
        return res.send(error(404,'No Completed Challenges Found',[]))
      }
      return res.send(success(200,'Completed Challenges',completedchallenges))
    }catch (err){
      return res.send(error(500,err.message));
    }
  }

  export async function getChallengeController(req,res){
    try {
        
        const challengeDetails = await createChallengeModel.find({});
        

        if(! challengeDetails){
            return res.send(error(404,"no challenge exit"))
        }
        return res.send(success(200, challengeDetails));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}