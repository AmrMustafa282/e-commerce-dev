import { catchAsync } from "./../utils/catchAsync.js";
import { prisma } from "./categoryController.js";

export const getAllCategories = catchAsync(async (req, res, next) => {
 const categories = await prisma.category.findMany({
  // include: {
  //  billboard: true,
  // },
 });

 res.status(200).json({
  categories,
 });
});
