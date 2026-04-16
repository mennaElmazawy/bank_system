
import { statusEnum } from "../../common/enum/BankAccount.enum.js";
import { successResponse } from "../../common/utils/responses/response.success.js";
import * as db_service from "../../DB/db.service.js"
import bankAccountModel from "../../DB/models/BankAccount.model.js";
import transactionModel from "../../DB/models/Transaction.model.js";


export const deposit = async (req, res) => {
    const { amount } = req.body;
    if (amount <= 0) {
        throw new Error("you must enter valid amount");
    }
    const account = await db_service.findOne({ model: bankAccountModel, filter: { userId: req.user._id } });
    if (!account) {
        throw new Error("Account not found");
    }
    if (account.status === statusEnum.frozen || account.status===statusEnum.inactive) {
        throw new Error("Account is not active");
    }
    const balanceBefore = account.balance;
    const updatedAccount = await db_service.findOneAndUpdate({
        model: bankAccountModel,
        filter: { userId: req.user._id },
        update: { $inc: { balance: amount } },
        options: { new: true }
    });
    const balanceAfter = updatedAccount.balance;
    await db_service.create({
        model: transactionModel,
        data: {

            accountId: account._id,
            type: "deposit",
            amount,
            balanceBefore,
            balanceAfter,
            status: "completed",
        },
    });

    successResponse({ res, status: 200, message: "Deposit successful", data: updatedAccount })

}


export const withdraw = async (req, res) => {
    const { amount } = req.body;
    if (amount <= 0) {
        throw new Error("you must enter valid amount");
    }
    const account = await db_service.findOne({ model: bankAccountModel, filter: { userId: req.user._id } });
    if (!account) {
        throw new Error("Account not found");
    }
    if (account.status === statusEnum.frozen || account.status===statusEnum.inactive) {
        throw new Error("Account is not active");
    }
    if (account.balance < amount) {
        throw new Error("Insufficient balance");
    }
    const balanceBefore = account.balance;
    const updatedAccount = await db_service.findOneAndUpdate({
        model: bankAccountModel,
        filter: { userId: req.user._id },
        update: { $inc: { balance: -amount } },
        options: { new: true }
    });
    const balanceAfter = updatedAccount.balance;
    await db_service.create({
        model: transactionModel,
        data: {
            accountId: account._id,
            type: "withdraw",
            amount,
            balanceBefore,
            balanceAfter,
            status: "completed",
        },
    });

    successResponse({ res, status: 200, message: "Withdrawal successful", data: updatedAccount })

}


export const getTransaction = async (req, res) => {
    const userId = req.user._id;
    const transactionId = req.params.id;

    const account = await bankAccountModel.findOne({ userId });
    if (!account) {
        throw new Error("Account not found");
    }
    const transaction = await db_service.findOne({
        model: transactionModel, filter: {
            _id: transactionId,
            accountId: account._id
        }
    });
    if (!transaction) {
        throw new Error("Transaction not found");
    }

    successResponse({ res, status: 200, message: "Transaction retrieved successfully", data: transaction })
}

export const getMyTransactions = async (req, res) => {

    const userId = req.user._id;

    const account = await db_service.findOne({ model: bankAccountModel, filter: { userId } });
    if (!account) {
        throw new Error("Account not found");
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const transactions = await db_service.find({
        model: transactionModel,
        filter: { accountId: account._id },
        options: {
            skip,
            limit,
            sort: { createdAt: -1 }
        }

    });

    successResponse({ res, status: 200, message: "Transactions retrieved successfully", data: transactions })
}


export const transfer = async (req, res) => {
    const { amount, recipientAccountNumber } = req.body;
    if (amount <= 0) {
        throw new Error("you must enter valid amount");
    }
    const senderAccount = await db_service.findOne({ model: bankAccountModel, filter: { userId: req.user._id } });
    if (!senderAccount) {
        throw new Error("Sender account not found");
    }
    if (senderAccount.status !== "active") {
        throw new Error("Sender account is not active");
    }
    if (senderAccount.balance < amount) {
        throw new Error("Insufficient balance");
    }
    const recipientAccount = await db_service.findOne({ model: bankAccountModel, filter: { accountNumber: recipientAccountNumber } });
    if (!recipientAccount) {
        throw new Error("Recipient account not found");
    }
    if (recipientAccount.status !== "active") {
        throw new Error("Recipient account is not active");
    }
    const senderBalanceBefore = senderAccount.balance;
    const recipientBalanceBefore = recipientAccount.balance;

    senderAccount.balance -= amount;
    recipientAccount.balance += amount;

    await senderAccount.save();
    await recipientAccount.save();


    await db_service.create({
        model: transactionModel,
        data: {
            accountId: senderAccount._id,
            type: "transfer",
            amount,
            balanceBefore: senderBalanceBefore,
            balanceAfter: senderAccount.balance,
            status: "completed",

        },
    });
    await db_service.create({
        model: transactionModel,
        data: {
            accountId: recipientAccount._id,
            type: "transfer",
            amount,
            balanceBefore: recipientBalanceBefore,
            balanceAfter: recipientAccount.balance,
            status: "completed",

        },
    });

    successResponse({ res, status: 200, message: "Transfer successful" })
}

export const getTransactionSummary = async (req, res) => {
    const userId = req.user._id;
    const account = await db_service.findOne({ model: bankAccountModel, filter: { userId } });
    if (!account) {
        throw new Error("Account not found");
    }
    const accountId = account._id;
    const summary = await transactionModel.aggregate([
        {
            $match: { accountId }
        },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" }
            }
        }
    ]);
    let deposits;
    let withdrawals;
    summary.forEach(item => {
        if (item._id === "deposit") {
            deposits = item.total;
        }
        if (item._id === "withdraw") {
            withdrawals = item.total;
        }
    });
    successResponse({
        res, status: 200, message: "Transfer successful", data: {
            totalDeposits: deposits,
            totalWithdrawals: withdrawals,
            currentBalance: account.balance
        }
    })
}






