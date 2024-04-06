import express from "express";
const router = express.Router();

import { protect, restrictTo } from "./../controllers/authController.js";
import {
 getAllOrders,
 getOrder,
 updateOrder,
 deleteOrder,
 createOrder,
} from "../controllers/orderController.js";

import {
 createOrderItem,
 deleteOrderItem,
 updateOrderItem,
} from "../controllers/orderItemController.js";

router.use(protect);
router.route("/").post(createOrder);
router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder);

router.route("/:id").post(createOrderItem);
router.route("/:id/:itemId").patch(updateOrderItem).delete(deleteOrderItem);

router.use(restrictTo("admin"));

router.route("/").get(getAllOrders);

export default router;
