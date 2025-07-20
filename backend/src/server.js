import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.route.js"
import transactionsRoutes from "./routes/transaction.route.js"
import connectDB from "./lib/connectDB.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT

// Middlewares
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/transactions", transactionsRoutes)

// start Server
connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
    })
})

// URL - http://localhost:5001/
// Command - cd backend;
//           npm run dev