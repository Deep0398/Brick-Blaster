import mongoose from "mongoose";

const commonSchema = mongoose.Schema({
   
    referralCode:{
        type:String,
     
    },
    isReferred:{
        type:Boolean,
        default:false
    },
    isReferUsed:{
        type:Boolean,
        default:false
    },
    referedCount:{type:Number,default:0},
   coins:{
        type:Number,
        default:0,
        min:0
    },
    INR:{
        type:Number,
        default:0,
        min:0
    },
    level:{
        type:Number,
        default:1
    },
    Balls:{
        type:Number,
        default:5,
        min:0
    },
    highestScore:{
        type:Number,
        default:0,
        min:0
    },
    ruby:{
        type: Number,
        default:0,
        min:0
    },
    powerups1:{
        type: Number,
        default:0,
        min:0,
    },
    powerups2:{
        type: Number,
        default:0,
        min:0
    },
    powerups3:{
        type: Number,
        default:0,
        min:0
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
const facebookSchema = new mongoose.Schema({
    facebookID:{
        type:String,
        unique:true
       
    },
    name:{
        type:String,
        
    }
})


export const userModel = mongoose.model('user', commonSchema);
export const facebookModel = userModel.discriminator('facebookPlayer',facebookSchema);
export  const guestModel = userModel.discriminator('guestPlayer', guestSchema);
export const authModel = userModel.discriminator('authPlayer', authSchema);