import joi from "joi";
import {  Types } from "mongoose";

export const getStatementSchema ={
    query:joi.object({
        startDate:joi.date().required(),
        endDate:joi.date().min(joi.ref("startDate")).required()
    }).required()
}


export const freezeAccountSchema = {
  params: joi.object({
    id: joi.string().custom((value, helper) => {
        const isValid=Types.ObjectId.isValid(value);
        return isValid ? value : helper.message("invalid Id");
    }),
  }).required()
}