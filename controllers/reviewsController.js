import { PrismaClient } from "@prisma/client";

import { AppError } from "./../utils/appError.js";
import { catchAsync } from "./../utils/catchAsync.js";

const prisma = new PrismaClient();

export const createReview = catchAsync(async (req, res, next) => {
 //  console.log(req.file);
 const { id: productId } = req.params;
 const { text, rating } = req.body;
 const { id: userId } = req.user;

 const review = await prisma.review.create({
  data: {
   productId,
   userId,
   text,
   rating,
   //  upvotes: {
   //   create: [],
   //  },
  },
  include: {
   user: {
    select: {
     username: true,
     email: true,
     id: true,
    },
   },
   upvotes: true,
  },
 });
 res.status(201).json({
  status: "success",
  review,
 });
});
export const updateReview = catchAsync(async (req, res, next) => {
 const { text, rating } = req.body;
 const { id: userId } = req.user;

 const review = await prisma.review.update({
  where: { id: req.params.id, userId },
  data: {
   text,
   rating,
  },
  include: {
   user: true,
   upvotes: true,
  },
 });

 if (!review) {
  return next(new AppError("You dont have permission do to this action", 403));
 }

 res.status(200).json({
  status: "success",
  review,
 });
});
export const getAllReviewsOfProduct = catchAsync(async (req, res, next) => {
 const reviews = await prisma.review.findMany({
  where: { productId: req.params.id },
  include: {
   user: {
    select: {
     id: true,
     username: true,
     email: true,
    },
   },
   upvotes: true,
  },
  orderBy: {
   upvoteCount: "desc",
  },
 });

 res.status(200).json({
  reviews,
 });
});
export const deleteReview = catchAsync(async (req, res, next) => {
 const { id: userId } = req.user;

 const review = await prisma.review.delete({
  where: {
   id: req.params.id,
   userId,
  },
 });
 if (!review) {
  return next(new AppError("You dont have permission do to this action", 403));
 }
 res.status(204).json({
  status: "success",
  data: null,
 });
});

export const upvote = catchAsync(async (req, res, next) => {
 //  const { id: userId } = req.user;
 const { id: reviewId } = req.params;
 let review = null;
 const upvote = await prisma.upvote.findFirst({
  where: {
   userId: req.user.id,
   reviewId,
  },
 });
 if (upvote) {
  await prisma.upvote.delete({
   where: {
    id: upvote.id,
   },
  });
  review = await prisma.review.update({
   where: { id: reviewId },
   data: {
    upvoteCount: {
     decrement: 1,
    },
    upvotes: {
     create: [],
    },
   },
   include: {
    upvotes: true,
   },
  });
 } else {
  const upvote = await prisma.upvote.create({
   data: {
    userId: req.user.id,
    reviewId,
   },
  });
  review = await prisma.review.update({
   where: { id: reviewId },
   data: {
    upvoteCount: {
     increment: 1,
    },
    upvotes: {
     create: [],
    },
   },
   include: {
    upvotes: true,
   },
  });
 }

 res.status(200).json({
  status: "success",

  review,
 });
});
