import { PrismaClient } from "@prisma/client";
import { catchAsync } from "./../utils/catchAsync.js";
import { getAll, getOne, deleteOne, updateOne } from "./handlerFactory.js";


const prisma = new PrismaClient();
const model = 'size';

export const createSize = catchAsync(async (req, res, next) => {
 const { name, value } = req.body;

 const size = await prisma.size.create({
  data: {
   name,
   value,
  },
 });

 res.status(201).json({
  status: "success",
  data: {
   size,
  },
 });
});

export const getAllSizes = catchAsync(async (req, res, next) => {
 const sizes = await prisma.size.findMany({
  include: { products: true },
 });

 res.status(200).json({
  sizes,
 });
});
export const getSize = getOne(model);

export const updateSize = updateOne(model);
export const deleteSize = deleteOne(model);
