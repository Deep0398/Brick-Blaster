import achivementModel from "../models/Achievment.js";
import userModel from "../models/User.js";
import statuscode from 'http-status-codes';



export async function retrieveAchievementController(req,res){
    try {
        const user = req._id;
        const achievements = await achivementModel.find({user}).populate('user');
        if(achievements.length<1){
            return res.send("No achievement available yet!");
        }
        return res.send(achievements);
        
    } catch (error) {
        res.status(statuscode.INTERNAL_SERVER_ERROR).send({"msg":error.message});
    }
}
export async function retrieveAllAchievementsController(req, res) {
    try {
      
      const achievements = await achivementModel.find().populate('user');
  
      if (achievements.length < 1) {
        return res.send("No achievements available yet!");
      }
  
      return res.send(achievements);
    } catch (error) {
      res.status(statuscode.INTERNAL_SERVER_ERROR).send({ "msg": error.message });
    }
  }


export async function insertAchievementController(req,res){
    try {
        const {id,status,description} = req.body;
        if(!id || !status || !description)
        return res.status(statuscode.BAD_REQUEST).send("missing fields!");
    
        const user = req._id;
        const achievement = new achivementModel({id,status,description,user});
        const createdAchievement = await achievement.save();
        
        const currUser = await userModel.findById(user);
        currUser.Achievments.push(createdAchievement._id);
        await currUser.save();

       
        res.status(statuscode.OK).send(createdAchievement);
    } catch (error) {
        res.status(statuscode.INTERNAL_SERVER_ERROR).send({"msg":error.message});
    }
}

export async function updateAchievementController(req,res){

}