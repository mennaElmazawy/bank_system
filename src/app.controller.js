
import express from 'express'
import checkConnection from './DB/ConnectionDB.js'
import { PORT, } from '../config/config.service.js'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import userRouter from './modules/user/user.controller.js'
import accountsRouter from './modules/accounts/accounts.controller.js'
import transactionsRouter from './modules/transactions/transaction.controller.js'


const app = express()
const port = PORT



const bootstrap = () => {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 20,
        message: "Too many requests from this IP, please try again after 15 minutes",
        statusCode:400,
        requestPropertyName:"rateLimit"

    })

    app.use(
        helmet(),
        limiter,
        express.json()
    )
    checkConnection();

    app.get("/", (req, res) => {
        return res.json({ message: "Welcome to the exam" });
    });
    
    app.use("/auth", userRouter)
    app.use("/accounts", accountsRouter)
    app.use("/transactions", transactionsRouter)
  

    app.use("{/*demo}", (req, res) => {
        throw new Error(`Url ${req.originalUrl} not found `, { cause: 404 })
    })
    app.use(async (err, req, res, next) => {
       
        res.status(err.cause || 500).json({ message: err.message, stack: err.stack })
    })

    app.listen(port, () => console.log(`exam listening on port ${port}!`))
}


export default bootstrap;