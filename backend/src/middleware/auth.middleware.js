import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const verifyToken = async(req, res, next) => {
    try {
        const token = req.cookies.token
        if(!token)
            return res.status(401).json({message: "Unauthorised - No token provided."})

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded)
            return res.status(401).json({message: "Unauthorised - User Not Found."})

        const user = await User.findById(decoded.id).select("-password")
        if(!user)
            return res.status(401).json({message: "Unauthorised - User Not Found."})

        req.user = user
        next()

    } catch (error) {
        console.log("error in verifyToken middleware", error)
        res.status(500).json({message: "Internal Server Error"})
    }
}