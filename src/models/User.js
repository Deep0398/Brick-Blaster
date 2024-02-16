import mongoose from "mongoose";

const commonSchema = mongoose.Schema({
   
    referralCode:{
        type:String,
     
    },
  
   coins:{
        type:Number,
        default:0
    },
    Balls:{
        type:Number,
        default:5
    },
    highestScore:{
        type:Number,
        default:0
    },
    ruby:{
        type: Number,
        default:0
    },
    powerups1:{
        type: Number,
        default:0
    },
    powerups2:{
        type: Number,
        default:0
    },
    powerups3:{
        type: Number,
        default:0
    },
    achievements:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"achievement"
         
        }
    ],
    levels:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'level'
        }
    ]
},{timestamps:true}
)
const guestSchema = new mongoose.Schema({
    deviceID:{
        type:String,
        unique:true,
        required:true
    }
})
const authSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        required:true
        
    }
})


export const userModel = mongoose.model('user', commonSchema);

export  const guestModel = userModel.discriminator('guestPlayer', guestSchema);
export const authModel = userModel.discriminator('authPlayer', authSchema);