import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.route.js"
import transactionsRoutes from "./routes/transaction.route.js"
import connectDB from "./lib/connectDB.js"
import path from "path"

dotenv.config()

const app = express()
const PORT = process.env.PORT

const __dirname = path.resolve()

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

// for deployment
if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

// start Server
connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
    })
})

// URL - http://localhost:5001/
// Command - cd backend;
//           npm run dev