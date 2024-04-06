import { PrismaClient } from "@prisma/client";
import { catchAsync } from "./../utils/catchAsync.js";

const prisma = new PrismaClient();

export const createOrderItem = catchAsync(async (req, res, next) => {
 const { productId } = req.body;
  const orderId = req.params.id;
  
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include:{orderItems: true}
  })

  for (const i in order.orderItems) {
    if (order.orderItems[i].productId === productId)
    {
      const addedItem = await prisma.orderItem.update({
       where: { id: "c7fabc89-95bb-4656-8d86-2b8c59af4b51" },
       data: { amount: +order.orderItems[i].amount + 1 },
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
