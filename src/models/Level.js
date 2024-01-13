import mongoose from "mongoose";

const levelSchema = mongoose.Schema({
    level : {type:Number},
    status:{type:Boolean},
    score:{type:Number,default:0},
    stars:{type:Number,default:0},
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

const levelModel = mongoose.model('level',levelSchema);
export default levelModel;