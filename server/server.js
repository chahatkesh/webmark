import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoute.js'
import bookmarkRouter from './routes/bookmarkRoute.js'
import statsRoute from './routes/statsRoute.js';
import { initializeCronJobs } from './utils/cronJobs.js';
import 'dotenv/config'

// app config
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json())
app.use(cors())

// DB Connection
connectDB();

// Initialize cron jobs
initializeCronJobs();

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/bookmarks", bookmarkRouter)
app.use('/api/stats', statsRoute);

app.get('/', (req, res) => {
  res.send("API Working")
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})