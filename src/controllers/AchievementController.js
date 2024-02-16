import achievementModel from "../models/Achievment.js";
import {userModel} from "../models/User.js";
import { error, success } from "../utills/responseWrapper.utills.js";




export async function retrieveAchievementController(req,res){
    try {
        const user = req._id;
        const achievements = await achievementModel.find({user}).populate('user');
        if(achievements.length<1){
            return res.send(error(404,"No achievement available yet!"));
        }
        return res.send(success(200,achievements));
        
    } catch (err) {
      return res.send(error(500,err.message));
    }
}
export async function retrieveAllAchievementsController(req, res) {
    try {
      
      const achievements = await achievementModel.find().populate('user');
  
      if (achievements.length < 1) {
        return res.send(error(404,"No achievements available yet!"));
      }
  
      return res.send(success(200,achievements));
    } catch (err) {
      return res.send(error(500,err.message));
    }
  }


export async function insertAchievementController(req,res){
    try {
        const {id,status,description} = req.body;
        if(!id || !status || !description)
        return res.send(error(422,"insufficient data"));
    
        const user = req._id;
        const achievement = new achievementModel({id,status,description,user});
        const createdAchievement = await achievement.save();
        
        const currUser = await userModel.findById(user);
        currUser.achievments.push(createdAchievement._id);
        await currUser.save();

       
         return res.send(success(200,"achievement posted successfully"));
    } catch (err) {
         return res.send(error(500,err.message));
    }
}

export async function updateAchievementController(req,res){

}