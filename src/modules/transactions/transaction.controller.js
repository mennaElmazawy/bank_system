import { Router } from "express";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import * as TS from "./transaction.services.js"
import { validation } from "../../common/middleware/validation.js";
import { getTransactionSchema, transactionSchema, transferSchema } from "./transaction.validation.js";



const transactionsRouter = Router();

transactionsRouter.post("/deposit", authentication, validation(transactionSchema), TS.deposit);
transactionsRouter.post("/withdraw", authentication, validation(transactionSchema), TS.withdraw);
transactionsRouter.get("/my", authentication, TS.getMyTransactions)
transactionsRouter.get("/transaction/:id", authentication, validation(getTransactionSchema), TS.getTransaction);
transactionsRouter.post("/transfer", authentication, validation(transferSchema), TS.transfer);
transactionsRouter.get("/my/summary", authentication, TS.getTransactionSummary);



export default transactionsRouter;