import mongoose from "mongoose";

const achievementSchema = mongoose.Schema({
    id:{type:String,unique:true,required:true},
    status:{type:Boolean},
    description:{type:String},
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})

const achievementModel = mongoose.model('achievement',achievementSchema);
export default achievementModel;