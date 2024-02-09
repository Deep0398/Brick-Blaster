import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    deviceID:{
        type:String,
        required:true,
        unique:true
    },
    referralCode:{
        type:String,
     
    },
    name:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        // required:true,
        // unique:true
    },
    profileURL:{
        type:String,
        default:null
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


const userModel = mongoose.model('user',userSchema);
export default userModel;