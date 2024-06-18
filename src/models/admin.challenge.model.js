import mongoose from 'mongoose'

const createChallengeSchema = mongoose.Schema({
    referenceId: {
        type: String,
        unique: true, 
        required: true
      },
    name:{
      type:String,
      required:true
    },
    challengetype:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true
    },
    challengetype:{
        type:String,
        required:true,
        enum: ['ball','level','ballShoot','coinSpend','coin','star','brick ','brickOneByOne','maxBrickDestroy']
    },
    taskamount:{
        type: Number,
        required:true
    },
    rewards:{
        type: Number,
        required:true
    },
    duration:{
        type: Number,
        required:true
    }
},{timestamps:true})

const createChallengeModel = mongoose.model('createChallenge',createChallengeSchema)
export default createChallengeModel