import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoute.js'
import bookmarkRouter from './routes/bookmarkRoutes.js' // Ensure this path is correct
import 'dotenv/config'

// app config
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json())
app.use(cors())

// DB Connection
connectDB();

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/bookmarks", bookmarkRouter) // Ensure this path is correct

app.get('/', (req, res) => {
  res.send("API Working")
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})