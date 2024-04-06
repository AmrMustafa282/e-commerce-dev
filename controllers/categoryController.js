import { PrismaClient } from "@prisma/client";
import { catchAsync } from "./../utils/catchAsync.js";
import { getAll, getOne, deleteOne, updateOne } from "./handlerFactory.js";

const prisma = new PrismaClient();
const model = "category";

export const createCategory = catchAsync(async (req, res, next) => {
 const { name, billboardId } = req.body;

 const category = await prisma.category.create({
  data: {
   name,
   billboardId,
  },
 });

 res.status(201).json({
  status: "success",
  data: {
   category,
  },
 });
});

export const getAllCategories = catchAsync(async (req, res, next) => {
 const categories = await prisma.category.findMany({
  include: { products: true },
 });

 res.status(200).json({
  categories,
 });
});
export const getCategory = getOne(model);

export const updateCategory = updateOne(model);
export const deleteCategory = deleteOne(model);
