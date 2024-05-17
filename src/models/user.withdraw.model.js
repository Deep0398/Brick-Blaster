import {mongoose} from "mongoose";

const withdrawRequest = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
    },
    upi_Id:{
type:String
    },
    name:{
        type:String,
        required:true
    },
    mobile_number:{
        type:Number,
        maxlength:10,
        minlength:10,
        required:true
    },
    accountnumber:{
        type: String
    },
    IfscCode:{
        type:String
    },
    amount:{
        type:Number
    
    },
status: {
  type: String,
  enum: ['pending', 'completed', 'cancelled'],
  default:'pending'
},
},{timestamps:true}
)
const WithDrawModel = mongoose.model("WithDrawRequest",withdrawRequest)
export default WithDrawModel