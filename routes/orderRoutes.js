import express from "express";
const router = express.Router();

import { protect, restrictTo } from "./../controllers/authController.js";
import {
 getAllOrders,
 getOrder,
 updateOrder,
 deleteOrder,
 createOrder,
 getCheckoutSession,
 getUserOrder,
 deleteAllOrders,
} from "../controllers/orderController.js";

import {
 createOrderItem,
 deleteAllOrderItems,
 deleteOrderItem,
 updateOrderItem,
} from "../controllers/orderItemController.js";

// router.route("/deleteItems").delete(deleteAllOrderItems);
router.use(protect);
router.get("/checkout-session/:orderId", getCheckoutSession);

router.route("/").post(createOrder).delete(deleteAllOrders);
router.route("/me/:userId").get(getUserOrder);
router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder);

router.route("/:id").post(createOrderItem);
router.route("/deleteItems").delete(deleteAllOrderItems);
router.route("/:id/:itemId").patch(updateOrderItem).delete(deleteOrderItem);

router.use(restrictTo("admin"));

router.route("/").get(getAllOrders);

export default router;
