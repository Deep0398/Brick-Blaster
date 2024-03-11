import {userModel} from "../models/User.js";
import {success,error} from "../utills/responseWrapper.utills.js"
export async function updateCoinController(req,res){
    const id =req._id;
    const Coins = req.body.Coins;
    try {
        const user =await userModel.findById(id);
        if(!user){
            return res.send(error(404,"user not found"));
        }
        user.coins += Coins;
        
        if (user.coins<0){
            user.coins = 0;
        }
        await user.save();
        return res.send(success(200,"coins updated successfully"));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function updateBallController(req,res){
    const id = req._id;
    const balls = req.body.balls;
    try {
        const user =await userModel.findById(id);
        if(!user){
            return res.send(error(404,"user not found"));
        }
        user.Balls += balls;
        if (user.Balls<0){
            user.Balls = 0;
        }
        await user.save();
        return res.send(success(200,"balls updated successfully"));
    } catch (err) {
        return res.send(error(500,err.message));
    
    }
}

export async function updateUserController (req,res){
    try {
        const userID = req._id;
        const user = await userModel.findById(userID);
        user.isReferred = false;
        await user.save();
        return res.send(success(200,"user updated successfully"))
    } catch (err) {
        return res.send(error(500,err.message));
    }
}
