import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
dotenv.config();
const app = express();
app.use(express.json());
const Port = process.env.PORT || 5000;
app.use("/api/auth", authRouter);
app.listen(Port, () => {
    console.log("Service is running on", Port);
});
