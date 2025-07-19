import mongoose from "mongoose";
import bcrypt from "bcryptjs"

// creating schema for the transaction logs
const transactionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// creating schema for the users
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    income: {
        type: Number,
        default: 0
    },
    expenses: {
        type: Number,
        default: 0
    },
    // transaction logs
    transactions: [transactionSchema]
}, {timestamps: true})
// "timestamps: true" allows us with these function - createdAt, updatedAt
// ex- member of the group is 'createdAt/updatedAt'

// pre-Hook
userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))
        return next()
    // if the password is NOT modified, next() (call next middleware)

    // if password is modified (or new), HASH it
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// the stored password is matched with the current password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", userSchema)

export default User