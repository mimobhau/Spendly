import express from "express"
import {
    signup,
    login,
    getHomeData,
    signout
} from "../controllers/auth.controller.js"
import {verifyToken} from "../middleware/auth.middleware.js"

const router = express.Router()

// routes
router.post("/signup", signup)
router.post("/login", login)
router.get("/", verifyToken, getHomeData)
router.post("/signout", signout)

export default router