
import mongoose from "mongoose";

const progressSchema = mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    challenge :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'challenge'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
},{timestamps: true})

const ProgressAmount = mongoose.model('progress',progressSchema);
export default ProgressAmount;