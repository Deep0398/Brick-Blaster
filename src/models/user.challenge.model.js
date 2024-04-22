import mongoose from "mongoose";

const challengeSchema = mongoose.Schema({

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
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
     
    }
})
const challengemodel =mongoose.model('challenge',challengeSchema)
export default challengemodel