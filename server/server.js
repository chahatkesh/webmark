import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoute.js'
import router from './routes/bookmarkRoutes.js'
import 'dotenv/config'


// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())


// DB Connection
connectDB();


// api endpoints
app.use("/api/user", userRouter)
app.use("/api/bookmarks", router)

app.get('/', (req, res) => {
  res.send("API Working")
})


app.listen(port, 4000, () => {
  console.log(`Server started on http://localhost:${port}`)
})