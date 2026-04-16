import { Router } from "express";
import * as UV from "./user.validation.js";
import * as US from "./user.services.js"
import { validation } from "../../common/middleware/validation.js";

const userRouter = Router();

userRouter.post("/Register", validation(UV.RegisterSchema), US.Register)
userRouter.post("/login", validation(UV.loginSchema), US.Login)

export default userRouter;