import mongoose from "mongoose";
import { currencyEnum, statusEnum } from "../../common/enum/BankAccount.enum.js";
const bankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true 
    },

    accountNumber: {
      type: String,
      unique: true,
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "EGP",
      enum:Object.values(currencyEnum),
    },

    status: {
      type: String,
      enum:Object.values(statusEnum),
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);


const bankAccountModel = mongoose.model.BankAccount || mongoose.model("BankAccount", bankAccountSchema);

export default bankAccountModel;