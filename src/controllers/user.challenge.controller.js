import createChallengeModel from "../models/admin.challenge.model.js";
import challengemodel from "../models/user.challenge.model.js";
import { userModel } from "../models/User.js";
import { success,error } from "../utills/responseWrapper.utills.js";

export async function insertChallengeController(req,res){
    try{
        const user =req._id;
        const {name} = req.body;

        const currUser = await userModel.findById(user)
        if(!currUser){
            return  res.status(500).send({message:"User not found"});
        }
        // const existingChallenge = await challengemodel.findOne({name})
        // if(existingChallenge){
        //     await challengemodel.deleteOne({name})
        // }

        const activeChallenge = await challengemodel.findOne({user,status:"incomplete"})
        if(activeChallenge){
          return res.status(400).send(400,'You already have a active challenge.Complete it before starting New One' )
        }
        // const existingChallenge = await challengemodel.findOne({name,status:"incomplete"});
        // if(existingChallenge){
        //   return res.send(error(400,'You already have a active challenge.Complete it before starting New One' ))
        // }

        const challengeDetails = await createChallengeModel.findOne({name})
        if(!challengeDetails){
      return res.status(404).send(404, 'Challenge Not Found')
    }
    if (!challengeDetails.isActive){
        return res.status(404).send(404, 'Challenge is not active')
    }
    
    // const startTime = istTime
    // const now = new Date()
    // const utcOffset = 5.5 *60 * 60 * 1000;
    //  const istTime = new Date(startTime.getTime() + utcOffset)

    // //   const startTime = istTime;
    //   const endTime = new Date(startTime.getTime() + challengeDetails.duration)

    //   const challengeInfo = new challengemodel ({user,startTime: startTime,endTime,name})
    //   const createdChallenge = await challengeInfo.save()

    const utcOffset = 5.5 * 60 * 60 * 1000;
        const startTime = new Date(Date.now() + utcOffset);
        const endTime = new Date(startTime.getTime() + challengeDetails.duration);

        const challengeInfo = new challengemodel({ user, startTime: startTime, endTime, name });
        const createdChallenge = await challengeInfo.save();

        if(!currUser.challenge){
            currUser.challenge = [];
        }

      currUser.challenge.push(createdChallenge._id)
      await currUser.save()

      const response = {
        _id: createdChallenge._id,
        name: createdChallenge.name,
        startTime: createdChallenge.startTime,
        status: createdChallenge.status,
        user: createdChallenge.user,
        duration:createdChallenge.duration,
        taskamount:createdChallenge.taskamount
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
        const challengeInfo = await challengemodel.findOne({name})
        
        
    if (status === "complete"){
        
        currUser.INR += challengeDetails.rewards
        currUser.challenges = currUser.challenges.filter(challengeId => challengeId.toString() !==challengeInfo._id.toString())
        await currUser.save()
    }
    const challengeDelete = await challengemodel.findOneAndDelete({name,user});
    if(!challengeInfo){
      return res.status(404).send(404,"No challenge have been played by you");
    }
    challengeInfo.status = status
    await challengeInfo.save()
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
        // const allChallenges = await challengemodel.find({user}).populate('user')
        // if(!allChallenges){
        //     return res.send(error(404,'User have Not played any challenge yet!'))
        // }

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
            duration: challenge.duration,
            taskamount:challenge.taskamount
            
        };
    })
    console.log(challengesResponse)

        console.log(allChallenges)
        return res.send(success(200,allChallenges))
    }catch(error){
        return res.status(500).send(500,err.message)
    }
}