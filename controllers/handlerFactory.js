import { catchAsync } from "./../utils/catchAsync.js";
import { AppError } from "./../utils/appError.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAll = (Model, searchOptions) =>
 catchAsync(async (req, res, next) => {
  try {
   const startIndex = parseInt(req.query.startIndex) || 0;
   const limit = parseInt(req.query.limit) || 16;
   const sortDirection = req.query.order === "asc" ? "asc" : "desc";
   const search = req.query.search || "";
    let searchArray =[]
   if (searchOptions) {
     searchArray = searchOptions.map((option) => ({ [option]  : {contains: search} }))
   }

   const doc = await prisma.user.findMany({
    where: {
     OR: searchArray ,
    },
    orderBy: {
     email: sortDirection, // [only for test]
     // updatedAt: 'asc', [my doc didnt have it yet]
    },
    skip: startIndex,
    take: limit,
   });

    const total = await prisma[Model].count();
    if (searchOptions[0] === 'username') {
      doc.forEach((d)=> d.password = undefined)
    }

   res.status(200).json({
    doc,
    total,
   });
  } catch (error) {
   next(error);
  }
 });

export const getOne = (Model) =>
 catchAsync(async (req, res, next) => {
  try {
   const doc = await prisma[Model].findUnique({
    where: { id: req.params.id },
   });

   if (!doc) {
    return next(new AppError("No document found with that ID"));
   }
    if (doc.password) {
     doc.password = undefined;
    }

   res.status(200).json({
    status: "success",
    data: {
     data: doc,
    },
   });
  } catch (error) {
   next(error);
  }
 });

export const createOne = (Model) =>
 catchAsync(async (req, res, next) => {
  try {
   const doc = await prisma[Model].create({
    data: req.body,
   });

   res.status(201).json({
    status: "success",
    data: {
     data: doc,
    },
   });
  } catch (error) {
   next(error);
  }
 });

export const deleteOne = (Model) =>
 catchAsync(async (req, res, next) => {
  try {
   const doc = await prisma[Model].delete({
    where: { id: req.params.id },
   });

   if (!doc) {
    return next(new Error("No document found with that ID"));
   }

   res.status(204).json({
    status: "success",
    data: null,
   });
  } catch (error) {
   next(error);
  }
 });

export const updateOne = (Model) =>
 catchAsync(async (req, res, next) => {
  try {
   const doc = await prisma[Model].update({
    where: { id: req.params.id },
    data: req.body,
   });

   if (!doc) {
    return next(new Error("No document found with that ID"));
   }

   res.status(200).json({
    status: "success",
    data: {
     data: doc,
    },
   });
  } catch (error) {
   next(error);
  }
 });
