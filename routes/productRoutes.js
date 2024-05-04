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
 getFeaturedProducts,
 relatedProducts,
 deleteRelation,
 getStates,
} from "../controllers/productController.js";

router.route("/").get(getAllProducts);
router.route("/featured").get(getFeaturedProducts);
router.route("/related").get(relatedProducts);
router.route("/getStates").get(protect, restrictTo("admin"), getStates);
router.route("/:id").get(getProduct);

router.use(protect);
router.use(restrictTo("admin"));

router
 .route("/")
 .post(uploadProductImages, resizeProductImages, createProduct)
 .delete(deleteAllProduct);
router
 .route("/:id")
 .patch(uploadProductImages, resizeProductImages, updateProduct)
 .delete(deleteProduct);

router.route("/relations/:id").delete(deleteRelation);
export default router;
