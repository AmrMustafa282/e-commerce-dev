import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import billboardRoutes from './routes/billboardRoutes.js'
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(express.static('public')) //__dirname
app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}))


const port = process.env.port || 3000;
app.listen(port,() => {
  console.log( `App running on post: ${port}`)  
})

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/billboards', billboardRoutes)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    status: 'failed',
    statusCode,
    message
  })
})