import { PrismaClient } from "@prisma/client";
import { catchAsync } from "./../utils/catchAsync.js";
import { getOne, deleteOne, updateOne, getOneByKey } from "./handlerFactory.js";

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
    include: {
      billboard: true,
      products: {
        where: { isArchived: false },
        include: {
          size: true,
          color: true,
          category: true,
          images: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  res.status(200).json({
    categories,
  });
});
export const getCategory = getOne(model);
export const getCategoryByName = catchAsync(async (req, res, next) => {
  try {
    const category = await prisma.category.findFirst({
      where: { name: req.params.name },
      include: {
        billboard: true,
        products: {
          where: { isArchived: false },
          include: {
            color: true,
            size: true,
            images: true,
            category: true,
          },
        },
      },
    });

    if (!category) {
      return next(new AppError("No document found with that ID"));
    }

    res.status(200).json({
      status: "success",
      category,
    });
  } catch (error) {
    next(error);
  }
});

export const updateCategory = updateOne(model);
export const deleteCategory = deleteOne(model);
