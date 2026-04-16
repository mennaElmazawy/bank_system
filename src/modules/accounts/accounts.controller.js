import { Router } from "express";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import * as AS from "./accounts.services.js"
import { freezeAccountSchema, getStatementSchema } from "./accounts.validation.js";
import { validation } from "../../common/middleware/validation.js";



const accountsRouter = Router();


accountsRouter.get("/me",authentication,AS.getMyAccount) 
accountsRouter.get("/me/statement",authentication,validation(getStatementSchema),AS.getAccountStatement)
accountsRouter.patch("/freeze/:id",authentication,authorization([RoleEnum.admin]),validation(freezeAccountSchema),AS.freezeAccount);

export default accountsRouter;