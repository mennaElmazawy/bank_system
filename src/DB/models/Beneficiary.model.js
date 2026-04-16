import mongoose from "mongoose";



const BeneficiarySchema = new mongoose.Schema({
    ownerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
  
    bankName: {
        type: String,
       
    },
    nickName:{
        type:String,
    }

})

const beneficiaryModel = mongoose.model.Beneficiary || mongoose.model("Beneficiary", BeneficiarySchema);

export default beneficiaryModel;