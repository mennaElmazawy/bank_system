import mongoose from "mongoose";
import {  RoleEnum } from "../../common/enum/user.enum.js";



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 8,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 8,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true
    },

    role: {
        type: String,
        required: true,
        enum: Object.values(RoleEnum),
        default: RoleEnum.admin
    },

}, {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals:true },
    toObject: { virtuals: true }
})


userSchema.virtual("userName")
    .get(function () {
        return this.firstName + " " + this.lastName
    })
    .set(function (value) {
        const [firstName, lastName] = value.split(" ");
        this.set({ firstName, lastName });


    })

const userModel = mongoose.model.User || mongoose.model("User", userSchema)

export default userModel;