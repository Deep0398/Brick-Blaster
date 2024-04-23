import ProgressAmount from "../models/progressamount.model.js";
import challengemodel from "../models/user.challenge.model.js";
import { userModel } from "../models/User.js";


export async function insertProgressAmountController(req,res){
    try {
        const {userId,progressAmount} = req.body

        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({messaging: "User Not Found"})
        }
        const progressAmountEntry = new ProgressAmount({
            amount : progressAmount,
            user : user._id
        })

        const savedProgressAmount = await progressAmountEntry.save()

        return res.status(200).send({message:"Progress amount Saves",savedProgressAmount})
    }catch(error){
        return res.status(500).send({message:error.message})
    }
}

export async function resetProgressAmountController(req,res){
    try {
        const {userId} = req.body
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({messaging: "User Not Found"})
        }
        const progressAmountEntry = await ProgressAmount.findOne({user:user._id})
        if(!progressAmountEntry){
            return res.status(404).send({messaging: "Progress Amount Not Found"})
        }
        progressAmountEntry.amount = 0
        const savedProgressAmount = await progressAmountEntry.save()
        return res.status(200).send({message:"Progress amount Reset",savedProgressAmount})
    }catch(error){
        return res.status(500).send({message:error.message})
    }
}