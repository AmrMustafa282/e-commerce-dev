import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import billboardRoutes from "./routes/billboardRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import colorRoutes from "./routes/colorRoutes.js";
import sizeRoutes from "./routes/sizeRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
import { webhookCheckout } from "./controllers/orderController.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(
 "/webhook-checkout",
 express.raw({ type: "*/*" }),
 webhookCheckout
); // we want it not in json but in a row formate

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, '/client/dist')))
// app.use(express.urlencoded({
//   extended: true,
// }))

const port = process.env.port || 3000;
app.listen(port, () => {
 console.log(`App running on post: ${port}`);
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/billboards", billboardRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/colors", colorRoutes);
app.use("/api/v1/sizes", sizeRoutes);
app.use("/api/v1/images", imageRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client','dist', 'index.html'))
})

app.use((err, req, res, next) => {
 const statusCode = err.statusCode || 500;
 const message = err.message || "Internal Server Error";
 res.status(statusCode).json({
  status: "failed",
  statusCode,
  message,
 });
});
