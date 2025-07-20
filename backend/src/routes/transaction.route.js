import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js"
import { addTransaction, deleteTransaction, editTransaction } from "../controllers/transaction.controller.js"

const router = express.Router()

// routes
router.post("/add", verifyToken, addTransaction)
router.delete("/:id", verifyToken, deleteTransaction)
router.put("/:id", verifyToken, editTransaction)

export default router