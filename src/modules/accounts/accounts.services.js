import { statusEnum } from "../../common/enum/BankAccount.enum.js";
import { successResponse } from "../../common/utils/responses/response.success.js";
import * as db_service from "../../DB/db.service.js"
import bankAccountModel from "../../DB/models/BankAccount.model.js";
import transactionModel from "../../DB/models/Transaction.model.js";



export const getMyAccount = async (req, res) => {
    const userId = req.user._id;
    const account = await db_service.findOne({ model: bankAccountModel, filter: { userId } });
    if (!account) {
        throw new Error("Account not found");
    }

    successResponse({ res, status: 200, message: "Account retrieved successfully", data: account })

}


export const getAccountStatement = async (req, res) => {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;
    const account = await db_service.findOne({ model: bankAccountModel, filter: { userId } });
    if (!account) {
        throw new Error("Account not found");
    }
    const transactions = await db_service.find({
        model: transactionModel,
        filter: {
            accountId: account._id,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        },
        options: {
            sort: { createdAt: -1 },

        }

    });
    successResponse({
        res, status: 200, message: "Account statement retrieved successfully",
        data: {
            balance: account.balance,
            transactions: transactions

        }
    })


}


export const freezeAccount = async (req, res) => {
    const accountId = req.params.id;

    const account = await db_service.findOne({ model: bankAccountModel, filter: { _id:accountId }});

    if (!account) {
        throw new Error("Account not found");
    }

    if (account.status ===statusEnum.frozen ) {
        throw new Error("Account is already frozen");
    }

    account.status = "frozen";
    await account.save();

    successResponse({res, status: 200, message: "Account frozen successfully",data: account });
};