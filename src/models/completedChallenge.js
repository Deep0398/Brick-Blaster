import mongoose from 'mongoose'

const completechallengeSchema = mongoose.Schema({
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    challenge:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'challenge'
    },
    completedAt:{
        type:Date,
        default:Date.now()
    },
    status :{
        type:String,
        enum:['complete','incomplete'],
        default:'complete'
    },
    referenceId:{
        type:String
    }
})
const CompletedChallenge = mongoose.model('completedChallenge',completechallengeSchema)
export default CompletedChallenge