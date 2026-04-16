import joi from "joi";


export const RegisterSchema = {
  body: joi.object({
    userName: joi.string().min(3).max(40).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    cpassword: joi.string().valid(joi.ref('password')).required()
  }).required()
}

export const loginSchema = {
  body: joi.object({
    email: joi.string().email().required(),
    password:joi.string().min(6).required(),
  }).required()
}