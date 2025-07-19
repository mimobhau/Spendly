import User from "../models/User.js"
import jwt from "jsonwebtoken"

const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
}

export const signup = async(req, res) => {
    
    try{
        const {fullName, email, password} = req.body
        
        if(!email || !password || !fullName)
            return res.status(400).json({message: "All fields are required."})
        if(password.length < 6)
            return res.status(400).json({message: "Password must be at least 6 characters."})

        // used for checking the format of the given email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
        return res.status(400).json({ message: "Invalid email format." });

        const exisitingUser = await User.findOne({email})
        if(exisitingUser)
            return res.status(400).json({message: "Email already exists."})

        const newUser = await User.create({fullName, email, password})

        const token = generateToken(newUser._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({message: "User registered successfully"})
    } catch (error) {
        console.log("Error in Signup controller.", error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const login = async(req, res) => {
    try {
        const {email, password} = req.body

        // checking presence of both email and password
        if(!email || !password)
            return res.status(400).json({message: "All fields are required."})

        const user = await User.findOne({email})
        if(!user)
            return res.status(400).json({message: "Invalid credentials"})

        const isMatch = await user.comparePassword(password)
        if(!isMatch)
            return res.status(400).json({message: "Invalid credentials"})

        const token = generateToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({message: "Logged in successfully.", user})

    } catch (error) {
        console.log("Error in Login controller.", error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const getHomeData = async(req, res) => {
    try {
        const user = req.user
        if(!user)
            return res.status(404).json({message: "User not found"})

        const {fullName, balance, income, expenses, transactions} = user
        res.status(200).json({ fullName, balance, income, expenses, transactions })

    } catch (error) {
        console.log("Error in getHomeData controller.", error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const signout = (req, res) => {
    res.clearCookie("token").json({message: "Signed out successfully"})
}