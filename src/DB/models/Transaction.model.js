import mongoose from "mongoose"
import { statusEnum, typeEnum } from "../../common/enum/transaction.enum.js";


const transactionSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(typeEnum),
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: Object.values(statusEnum),
     
    },

    balanceBefore: {
      type: Number,
      default: 0,
     
    },

    balanceAfter: {
      type: Number,
     default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const transactionModel = mongoose.model.Transaction || mongoose.model("Transaction", transactionSchema);

export default transactionModel;