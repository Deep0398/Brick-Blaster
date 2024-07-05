
import mongoose from "mongoose";

const kycSchema = mongoose.Schema({
    firstName:{
        type:String,
       
    },
    lastName :{
        type:String,
      
    },
    adharNumber : {
        type:String,
        required:true
    },
    panNumber :{
        type:String,
        required:true
    },
    adharFront:{
        type:String,
        required:true
    },
    adharBack:{
        type:String,
        required:true
    },
    panFront:{
        type:String,
        required:true
    },

    status:{
        type:Number,
        enum: [0, 1, 2], // 0: Pending, 1: Approved, 2: Rejected
        default: 0
    },
   user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
   }
}, {
    timestamps: true })

    const kycModel = mongoose.model('kyc',kycSchema)
    export default kycModel;