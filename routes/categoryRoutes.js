import express from "express";
const router = express.Router();

import { protect, restrictTo } from "./../controllers/authController.js";
import {
 getAllCategories,
 getCategory,
 updateCategory,
 deleteCategory,
 createCategory,
} from "../controllers/categoryController.js";

router.route("/").get(getAllCategories);
router.route("/:id").get(getCategory);

router.use(protect);
router.use(restrictTo("admin"));

router.route("/").post(createCategory);
router.route("/:id").patch(updateCategory).delete(deleteCategory);

export default router;
