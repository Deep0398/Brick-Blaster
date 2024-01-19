import levelModel from "../models/Level.js";
import userModel from "../models/User.js";
import {success,error} from "../utills/responseWrapper.utills.js"



export  async function postLevelController(req,res){
    try {
        const {level,status,score,stars} = req.body;
        if(!level || !status || !score || !stars)
        return res.send(error(422,"insufficient data"));
    
        const user = req._id;
        const levelInfo = new levelModel({level,status,score,stars,user});
        const createdLevel = await levelInfo.save();
                
        const currUser = await userModel.findById(user);
        currUser?.levels.push(createdLevel._id);
        await currUser.save();

        res.send(success(200,"level created successfully"));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export  async function getLevelController(req,res){
    try {
        const levelNo = req.params.levelNo;
        const user = req._id;
        const currUser = await userModel.findById(user);
        if(!currUser){
            return res.send(error(404,"user not found"));
        }
        const levelInfo = await levelModel.findOne({$and : [{"level":levelNo},{user}]}).populate('user');;
        if(!levelInfo){
            return res.send(error (404,"level info does not exist!"));
        }
        return res.send(success(200,levelInfo));
        
    } catch (err) {
        return res.send(error(500,err.message));
    }
}
export async function getAllLevelsController(req, res) {
    try {
      const user = req._id;
      const currUser = await userModel.findById(user);
  
      if (!currUser) {
        return res.send(error(404,'User does not exist!'));
      }
  
      const allLevels = await levelModel.find({ user }).populate('user');;
  
      if (!allLevels || allLevels.length === 0) {
        return res.send(error(404,'No level information available!'));
      }
  
      return res.send(success(200,allLevels));
    } catch (err) {
      return res.send(error(500,err.message));
    }
}
export  async function updateLevelController(req,res){
    try {
        const levelNo = req.params.levelNo;
        const user = req._id;
        const {score, stars} = req.body;
        const levelInfo = await levelModel.findOne({$and : [{"level":levelNo},{user}]});
        if(!levelInfo){
            return res.send(error(404,"level info does not exist!"));
        }

        if(levelInfo["score"]<score){
            levelInfo["score"]=score;
        }

        if(levelInfo["stars"]<stars){
            levelInfo["stars"]=stars;
        }

         await levelInfo.save();
        return res.send(success(200,"level updated successfully"));


    } catch (err) {
        
        return res.send(error(500,err.message));
    }
}
