import express from 'express';
import cors from 'cors'
import userRouter from './routes/user.route.mjs'
import authRouter from './routes/auth.route.mjs'
import dotenv from 'dotenv'
import verifyAdmin from './middlewares/verifyAdmin.mjs';
dotenv.config()

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/",(req,res)=>{
    res.status(200).json({msg:process.env.JWT_SECRET_ACCESS})
})
app.use("/api/v1/user", verifyAdmin , userRouter)
app.use("/api/v1/auth",authRouter)

app.listen(5000, () => {
    console.log("server in running on port : 5000")
})