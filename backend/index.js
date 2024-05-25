import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { dbConnect } from './utils/dbConnect.js'
import authRouter from './router/authRouter.js'
import morgan from 'morgan'


const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // your frontend's URL
    credentials: true,
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
dotenv.config()
dbConnect()

app.use('/api', authRouter)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is connected in ${PORT}`)
})