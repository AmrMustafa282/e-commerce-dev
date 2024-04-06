import { PrismaClient } from "@prisma/client";
import { catchAsync } from "./../utils/catchAsync.js";
import { getAll, getOne, deleteOne, updateOne } from "./handlerFactory.js";

const prisma = new PrismaClient();
const model = "image";



export const createImage = catchAsync(async (req, res, next) => {
 const { url, productId } = req.body;

 const image = await prisma.image.create({
  data: {
   productId,
   url,
  },
 });

 res.status(201).json({
  status: "success",
  data: {
   image,
  },
 });
});
export const updateImage = updateOne(model);
export const deleteImage = deleteOne(model);
