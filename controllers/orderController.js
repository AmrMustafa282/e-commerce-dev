import { PrismaClient } from "@prisma/client";
import { catchAsync } from "./../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { deleteAll } from "./handlerFactory.js";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = catchAsync(async (req, res, next) => {
 // 1) Get the currently booked tour
 const order = await prisma.order.findFirst({
  where: { id: req.params.orderId },
  include: {
   orderItems: {
    include: {
     product: {
      include: {
       images: true,
      },
     },
    },
   },
   user: true,
  },
 });
 // 2) Create checkout session  [npm i stripe]
 // console.log(order)
//  console.log(order.orderItems[0].product.images[0]);

 const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  success_url: `${req.protocol}://${req.get("host")}/`,
  cancel_url: `${req.protocol}://${req.get("host")}/`,
  customer_email: order.user.email,
  client_reference_id: req.params.orderId,
  mode: "payment",
  line_items: [
   {
    quantity: 1,
    price_data: {
     currency: "egp",
     unit_amount:
      order.orderItems.reduce((acc, item) => {
       const itemPrice = parseInt(item.amount) * parseInt(item.product.price);
       return acc + itemPrice;
      }, 0) * 100,

     // 100,
     product_data: {
      name: order.orderItems.map((item) => item.product.name).join(" ,"),
      description: order.orderItems
       .map((item) => item.product.description)
       .join(" ,"),
      images: order.orderItems.map(
       (item) =>
        `${req.protocol}://${req.get("host")}/img/product/${
         item.product.images[0].url
        }`
      ),
      //  [
      //   "https://static.zara.net/assets/public/ef35/f816/b44a4a02b4b8/78103cb08cc3/08574500806-e1/08574500806-e1.jpg?ts=1703759618908&w=750",
      //   "https://static.zara.net/assets/public/7dd5/b904/bbe7430eb666/2a16fbdb1feb/08574500806-a4/08574500806-a4.jpg?ts=1713195215620&w=750",
      //  ],
     },
    },
   },
  ],
 });

 // 3) Create session as response
 //  if (!req.user.isConfirmed) {
 //   return next(
 //    new AppError(
 //     "Please confirm your account before booking! check your profile.",
 //     400
 //    )
 //   );
 //  }
 res.status(200).json({
  status: "success",
  session,
 });
});

const createBookingCheckout = async (session) => {
 try {
  const orderId = session.client_reference_id;
  await prisma.order.update({
   where: { id: orderId },
   data: { status: "Sent", isPaid: true },
  });
 } catch (error) {
  console.log(error);
 }
};

export const webhookCheckout = (req, res, next) => {
 const signature = req.headers["stripe-signature"];
 let event;
 try {
  event = stripe.webhooks.constructEvent(
   req.body,
   signature,
   process.env.STRIPE_WEBHOOK_SECRET
  );
 } catch (err) {
  return res
   .status(400)
   .send(`Webhook error: ${err.message}`, req.body, signature);
 }

 if (event.type === "checkout.session.completed")
  createBookingCheckout(event.data.object);

 res.status(200).json({ received: true });
};

// [admin only]
export const getAllOrders = catchAsync(async (req, res, next) => {
 const startIndex = parseInt(req.query.startIndex) || 0;
 const limit = parseInt(req.query.limit) || 16;

 const orders = await prisma.order.findMany({
  include: { user: true, orderItems: true },
  // skip: startIndex,
  // take: limit,
 });

 orders.map((order) => (order.user.password = undefined));

 res.status(200).json({
  orders,
 });
});
// [reqsricted for same user and admin]
export const getOrder = catchAsync(async (req, res, next) => {
 const order = await prisma.order.findUnique({
  where: { id: req.params.id },
  include: {
   user: true,
   orderItems: true,
  },
 });

 if (!order) {
  return next(new AppError("No document found with that ID"));
 }

 if (req.user.id !== order.userId && req.user.role !== "admin") {
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

export const getUserOrder = catchAsync(async (req, res, next) => {
 const orders = await prisma.order.findMany({
  where: { userId: req.user.id },
  include: {
   orderItems: {
    include: {
     product: {
      include: {
       images: true,
       color: true,
      },
     },
    },
   },
  },
 });

 const currentOrder = orders?.find((order) => order.isPaid === false) || {};
 const paiedOrders = orders?.filter((order) => order.isPaid === true) || [];

 res.status(200).json({
  status: "success",
  currentOrder,
  paiedOrders,
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
 if (req.user.id !== order.userId && req.user.role !== "admin") {
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
 let order;
 const openOrder = await prisma.order.findFirst({
  where: {
   userId: req.user.id,
   isPaid: false,
  },
 });
 if (!openOrder) {
  order = await prisma.order.create({
   data: {
    userId: req.user.id,
   },
  });
 } else {
  order = openOrder;
 }

 res.status(201).json({
  status: "success",
  order,
 });
});

// [reqsricted for same user only]
export const updateOrder = catchAsync(async (req, res, next) => {
 const order = await prisma.order.findUnique({
  where: { id: req.params.id },
 });

 if (!order) {
  return next(new Error("No document found with that ID"));
 }

 if (req.user.id !== order.userId && req.user.role !== "admin") {
  return next(new AppError("You dont have permission to do this action"));
 }

 const updatedOrder = await prisma.order.update({
  where: { id: req.params.id },
  include: {
   user: true,
  },
  data: req.body,
 });

 res.status(200).json({
  status: "success",
  order: updatedOrder,
 });
});

export const deleteCompoletedOrders = catchAsync(async (req, res, next) => {
 if (req.user.role !== "admin") {
  return next(new AppError("You dont have permission to do this action"));
 }
 await prisma.order.deleteMany({
  where: {
   isPaid: true,
   status: "Recived",
  },
 });
 res.status(204).json({
  status: "success",
  data: null,
 });
});
export const deleteAllOrders = deleteAll("order");
