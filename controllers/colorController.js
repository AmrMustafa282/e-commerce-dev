import { PrismaClient } from "@prisma/client";
import { catchAsync } from "./../utils/catchAsync.js";
import { getAll, getOne, deleteOne, updateOne } from "./handlerFactory.js";


const prisma = new PrismaClient();
const model = 'color';

export const createColor = catchAsync(async (req, res, next) => {
 const { name, value } = req.body;

 const color = await prisma.color.create({
  data: {
   name,
   value,
  },
 });

 res.status(201).json({
  status: "success",
  data: {
   color,
  },
 });
});

export const getAllColors = catchAsync(async (req, res, next) => {
 const colors = await prisma.color.findMany({
  include: { products: true },
 });

 res.status(200).json({
  colors,
 });
});
export const getColor = getOne(model);

export const updateColor = updateOne(model);
export const deleteColor = deleteOne(model);
