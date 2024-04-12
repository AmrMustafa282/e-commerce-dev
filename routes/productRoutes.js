import express from "express";
const router = express.Router();

import { protect, restrictTo } from "./../controllers/authController.js";
import {
 getAllProducts,
 getProduct,
 updateProduct,
 deleteProduct,
 createProduct,
 uploadProductImages,
 resizeProductImages,
 deleteAllProduct,
} from "../controllers/productController.js";

router.route("/").get(getAllProducts);
router.route("/:id").get(getProduct);

router.use(protect);
router.use(restrictTo("admin"));

router
 .route("/")
 .post(uploadProductImages, resizeProductImages, createProduct)
 .delete(deleteAllProduct);
router.route("/:id").patch(updateProduct).delete(deleteProduct);

export default router;
