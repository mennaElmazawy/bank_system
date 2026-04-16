
import { randomUUID } from "crypto";
import { REFRESH_SECRET_KEY, SALT_ROUNDS, SECRET_KEY } from "../../../config/config.service.js";
import { successResponse } from "../../common/utils/responses/response.success.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import { GenerateToken } from "../../common/utils/token.service.js";
import * as db_service from "../../DB/db.service.js"
import userModel from "../../DB/models/users.model.js";
import bankAccountModel from "../../DB/models/BankAccount.model.js";

export const Register = async (req, res, next) => {
    const { userName, email, password } = req.body;
    if (await db_service.findOne({
        model: userModel,
        filter: { email }
    })) {
        throw new Error("email already exists", { cause: 409 })
    }

    const user = await db_service.create({
        model: userModel,
        data: {
            userName,
            email,
            password: Hash({ plainText: password, salt_Rounds: SALT_ROUNDS }),

        }
    })

    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    try {
        const account = await db_service.create({ model: bankAccountModel, data: { userId: user._id, accountNumber } });
        return successResponse({ res, status: 201, message: "User and bank account created successfully", data: { user, account } });

    } catch (err) {

        await db_service.deleteOne({ model: userModel, filter: { _id: user._id } });

        throw new Error("Failed to create bank account", { cause: 400 });
    }

}


export const Login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await db_service.findOne({
        model: userModel,
        filter: {
            email
        }
    })
    if (!user) {
        throw new Error("user not exist", { cause: 404 })
    }
    if (!Compare({ plainText: password, cipherText: user.password })) {
        throw new Error("invalid password", { cause: 400 })
    }
    const jwtid = randomUUID();
    const access_token = GenerateToken({
        payload: { id: user._id, email: user.email, role: user.role },
        secret_key: SECRET_KEY,
        options: {
            expiresIn: "1h",
            jwtid
        }
    })
    const Refresh_token = GenerateToken({
        payload: { id: user._id, email: user.email, role: user.role },
        secret_key: REFRESH_SECRET_KEY,
        options: {
            expiresIn: "1y",
            jwtid
        }
    })
    successResponse({ res, message: "login success", data: { access_token, Refresh_token } })
}


