import { PrismaClient } from "@prisma/client";
import { catchAsync } from "./../utils/catchAsync.js";
import { deleteAll } from "./handlerFactory.js";

const prisma = new PrismaClient();

export const createOrderItem = catchAsync(async (req, res, next) => {
 const productId = req.params.productId;
 const orderId = req.params.id;
 const size = req.body.size;

 const order = await prisma.order.findUnique({
  where: { id: orderId },
  include: { orderItems: true },
 });

 for (const i in order.orderItems) {
  if (
   order.orderItems[i].productId === productId &&
   order.orderItems[i].size === size
  ) {
   const addedItem = await prisma.orderItem.update({
    where: { id: order.orderItems[i].id },
    data: {
     amount: {
      increment: 1,
     },
    },
   });
   return res.status(201).json({
    status: "success",
    data: {
     addedItem,
    },
   });
  }
 }

 const orderItem = await prisma.orderItem.create({
  data: {
   productId,
   orderId,
   size,
  },
 });

 res.status(201).json({
  status: "success",
  data: {
   orderItem,
  },
 });
});
export const updateOrderItem = catchAsync(async (req, res, next) => {
 const orderItem = await prisma.orderItem.update({
  where: { id: req.params.itemId },
  data: req.body,
 });
 if (!orderItem) {
  return next(new Error("No document found with that ID"));
 }
 res.status(200).json({
  status: "success",
  data: {
   data: orderItem,
  },
 });
});
export const deleteOrderItem = catchAsync(async (req, res, next) => {
 try {
  const orderItem = await prisma.orderItem.delete({
   where: { id: req.params.itemId },
  });

  if (!orderItem) {
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

export const deleteAllOrderItems = deleteAll("orderItem");
