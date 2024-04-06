import express from "express";
const router = express.Router();

import { protect, restrictTo } from "./../controllers/authController.js";
import {
 getAllSizes,
 getSize,
 updateSize,
 deleteSize,
 createSize,
} from "../controllers/sizeController.js";


router.route("/").get(getAllSizes);
router.route("/:id").get(getSize);

router.use(protect);
router.use(restrictTo("admin"));

router
 .route("/")
 .post(createSize);
router.route("/:id").patch(updateSize).delete(deleteSize);

export default router;
