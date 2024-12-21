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
    kycstatus:{type:Number,default:0},
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
    challenges:[
        { challengeId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'challenge',
        },
        referenceId:String

        
        }],
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
        unique:true, 
    },
    name: String,
    friends: [
  {
    facebookID: String,
    name: String,
    isOnline: { type: Boolean, default: false },
    lastActive: Date,
  }
],
    isOnline: { type: Boolean, default: false },
    lastActive: Date,
    fcmToken : [String],
    friends: { type: [String], default: [] }, // Array of friend IDs

    gifts: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            senderFacebookID: String,
            senderName: String,
            receiverFacebookID: String, 
            receiverName: String,
            coins: Number,
            status: { type: String, default: "pending" },
            sentAt: { type: Date, default: Date.now },
        },
    ],
    lastGiftSent: { type: Object, default: {} },
},
{ timestamps: true }
)


export const userModel = mongoose.model('user', commonSchema);
export const facebookModel = userModel.discriminator('facebookPlayer',facebookSchema);
export  const guestModel = userModel.discriminator('guestPlayer', guestSchema);
export const authModel = userModel.discriminator('authPlayer', authSchema);