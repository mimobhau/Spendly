import User from "../models/User.js"
import jwt from "jsonwebtoken"

const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

export const addTransaction = async(req, res) => {
    try {
        const user = req.user
        const {description, amount} = req.body

        if(!description || typeof amount !== "number")
            return res.status(400).json({message: "Description and amount are required."})

        // create a transaction object
        const transaction = {
            description,
            amount,
            createdAt: new Date()
        }

        // update the user's transactions
        user.transactions.push(transaction)

        // update Balance, Income & Expenses
        user.balance += amount
        if(amount > 0)
            user.income += amount
        else
            user.expenses += Math.abs(amount)

        await user.save()

        res.status(200).json({
            message: "Transaction added successfully",
            balance: user.balance,
            income: user.income,
            expenses: user.expenses,
            transactions: user.transactions
        })

    } catch (error) {
        console.error("Error in addTransaction controller: ", error)
        res.status(500).json({message: "Internal Server Error."})
    }
}

export const deleteTransaction = async(req, res) => {
    try {
        const user = req.user
        const transactionId = req.params.id

        const transaction = user.transactions.id(transactionId)
        if(!transaction)
            return res.status(404).json({message: "Transaction not found"})

        // Adjust balance
        const amount = transaction.amount
        user.balance -= amount

        if(amount > 0)
            user.income -= amount
        else
            user.expenses -= Math.abs(amount)

        // Remove transaction
        user.transactions.pull({_id: transactionId})
        await user.save()

        res.status(200).json({
            message: "Transaction deleted successfully.",
            balance: user.balance,
            income: user.income,
            expenses: user.expenses,
            transactions:user.transactions
        })

    } catch (error) {
        console.error("Error in deleteTransaction controller: ", error)
        res.status(500).json({message: "Internal Server Error."})
    }
}

export const editTransaction = async(req, res) =>{
    try {
        const user = req.user
        const transactionId = req.params.id
        const {description, amount} = req.body

        const transaction = user.transactions.id(transactionId)
        if(!transaction)
            return res.status(404).json({message: "Transaction not found"})

        if(typeof amount !== "number" || !description)
            return res.status(400).json({message: "Description & Amount are required."})

        // Remove effect of old amount
        const oldAmount = transaction.amount
        user.balance -= oldAmount
        if(oldAmount > 0)
            user.income -= oldAmount
        else
            user.expenses -= Math.abs(oldAmount)

        // Update transaction
        transaction.description = description
        transaction.amount = amount
        transaction.createdAt = new Date()

        // Applty effect of new amount
        user.balance += amount
        if(amount > 0)
            user.income += amount
        else
            user.expenses += Math.abs(amount)

        await user.save()

        res.status(200).json({
            message: "Transaction updated succesfully",
            balance: user.balance,
            income: user.income,
            expenses: user.expenses,
            transactions: user.transactions
        })

    } catch (error) {
        console.error("Error in editTransaction controller: ", error)
        res.status(500).json({message: "Internal Server Error."})
    }
}