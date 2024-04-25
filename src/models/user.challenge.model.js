import mongoose from "mongoose";

const challengeSchema = mongoose.Schema({
    referenceId: {
        type: String,
        unique: true, 
        required: true
      },

    name:{
        type: String,
        required:true
    },
    startTime:{
        type: Date,
        required:true
    },
    endTime:{
        type: Date,
        required:true
    },
    status:{
        type: String,
        enum :['complete','incomplete'],
        default : 'incomplete'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
     
    },
    taskamount:{
        type:Number,
        default:0
    },
    duration:{
        type:Number,
        default:0
    }
},{timestamps:true})
const challengemodel =mongoose.model('challenge',challengeSchema)
export default challengemodel