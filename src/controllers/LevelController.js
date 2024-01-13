import levelModel from "../models/Level.js";
import userModel from "../models/User.js";



export  async function postLevelController(req,res){
    try {
        const {level,status,score,stars} = req.body;
        if(!level || !status || !score || !stars)
        return res.status(statuscode.BAD_REQUEST).send("missing fields!");
    
        const user = req._id;
        const levelInfo = new levelModel({level,status,score,stars,user});
        const createdLevel = await levelInfo.save();
                
        const currUser = await userModel.findById(user);
        currUser.Levels.push(createdLevel._id);
        await currUser.save();

        res.send(createdLevel);

    } catch (error) {
        return res.send(error.message);
    }
}

export  async function getLevelController(req,res){
    try {
        const levelNo = req.params.levelNo;
        const user = req._id;
        const currUser = await userModel.findById(user);
        if(!currUser){
            return res.send("user does not exist! ");
        }
        const levelInfo = await levelModel.findOne({$and : [{"level":levelNo},{user}]}).populate('user');;
        if(!levelInfo){
            return res.send("level info does not exist!");
        }
        return res.send(levelInfo);
        
    } catch (error) {
        return res.send(error.message);
    }
}
export async function getAllLevelsController(req, res) {
    try {
      const user = req._id;
      const currUser = await userModel.findById(user);
  
      if (!currUser) {
        return res.send('User does not exist!');
      }
  
      const allLevels = await levelModel.find({ user }).populate('user');;
  
      if (!allLevels || allLevels.length === 0) {
        return res.send('No level information available!');
      }
  
      return res.send(allLevels);
    } catch (error) {
      return res.send(error.message);
    }
}
export  async function updateLevelController(req,res){
    try {
        const levelNo = req.params.levelNo;
        const user = req._id;
        const {score, stars} = req.body;
        const levelInfo = await levelModel.findOne({$and : [{"level":levelNo},{user}]});
        if(!levelInfo){
            return res.send("level info does not exist!");
        }

        if(levelInfo["score"]<score){
            levelInfo["score"]=score;
        }

        if(levelInfo["stars"]<stars){
            levelInfo["stars"]=stars;
        }

        const savedLevel = await levelInfo.save();
        return res.send(savedLevel);


    } catch (error) {
        console.log(error);
        return res.send(error.message);
    }
}
