import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import billboardRoutes from './routes/billboardRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import colorRoutes from './routes/colorRoutes.js'
import sizeRoutes from './routes/sizeRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js' 

import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({
//   extended: true,
// }))


const port = process.env.port || 3000;
app.listen(port,() => {
  console.log( `App running on post: ${port}`)  
})

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/billboards', billboardRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/colors', colorRoutes)
app.use('/api/v1/sizes', sizeRoutes)
app.use('/api/v1/images', imageRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/orders', orderRoutes)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    status: 'failed',
    statusCode,
    message
  })
})