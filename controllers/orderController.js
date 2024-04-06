import { PrismaClient } from "@prisma/client";
import { catchAsync } from "./../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

const prisma = new PrismaClient();

// [admin only]
export const getAllOrders = catchAsync(async (req, res, next) => {

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 16;

  const orders = await prisma.order.findMany({
   include: { user: true, orderItems: true },
   skip: startIndex,
   take: limit,
  });

  orders.map((order)=> order.user.password =undefined)

  res.status(200).json({
   orders,
  });

});
// [reqsricted for same user and admin]
export const getOrder = catchAsync(async (req, res, next) => {
 const order = await prisma.order.findUnique({
  where: { id: req.params.id },
  include: { user: true, orderItems: true },
 });

  if (!order) {
   return next(new AppError("No document found with that ID"));
  }

 if (req.user.id !== order.userId && req.user.role !== 'admin') {
  return next(new AppError("You dont have permission to do this action"));
 }

  
  order.user.password = undefined;

 res.status(200).json({
  status: "success",
  data: {
   data: order,
  },
 });
});

// [reqsricted for same user and admin]
export const deleteOrder = catchAsync(async (req, res, next) => {
 const order = await prisma.order.findUnique({
  where: {
   id: req.params.id,
  },
 });

 if (!order) {
  return next(new Error("No document found with that ID"));
 }
 if (req.user.id !== order.userId && req.user.role !== 'admin') {
  return next(new AppError("You dont have permission to do this action"));
 }

 await prisma.order.delete({
  where: { id: req.params.id },
 });
 res.status(204).json({
  status: "success",
  data: null,
 });
});

// [reqsricted for same user only]
export const createOrder = catchAsync(async (req, res, next) => {
 if (req.user.id !== req.body.userId) {
  return next(new AppError("You dont have permission to do this action"));
 }

 const order = await prisma.order.create({
  data: req.body,
 });

 res.status(201).json({
  status: "success",
  data: {
   data: order,
  },
 });
});

// [reqsricted for same user only]
export const updateOrder = catchAsync(async (req, res, next) => {
 
  const order = await prisma.order.findUnique({
    where:{id: req.params.id}
  })

  if (!order) {
   return next(new Error("No document found with that ID"));
  }
 
  if (req.user.id !== order.userId ) {
   return next(new AppError("You dont have permission to do this action"));
  }

 const updatedOrder = await prisma.order.update({
  where: { id: req.params.id },
  data: req.body,
 });


 res.status(200).json({
  status: "success",
  data: {
   data: updatedOrder,
  },
 });
});
