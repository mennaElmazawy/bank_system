import joi from "joi";
import {  Types } from "mongoose";

export const transactionSchema = {
  body: joi.object({
    amount: joi.number().positive().required(),
  }).required()
}

export const getTransactionSchema = {
  params: joi.object({
    id: joi.string().custom((value, helper) => {
        const isValid=Types.ObjectId.isValid(value);
        return isValid ? value : helper.message("invalid Id");
    }),
  }).required()
}

export const transferSchema = {
  body: joi.object({
    amount: joi.number().positive().required(),
    recipientAccountNumber: joi.string().required(),
  }).required()
}

