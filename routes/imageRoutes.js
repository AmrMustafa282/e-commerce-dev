import express from "express";
const router = express.Router();

import { protect, restrictTo } from "./../controllers/authController.js";
import {
 updateImage,
 deleteImage,
 createImage,
} from "../controllers/imageController.js";



router.use(protect);
router.use(restrictTo("admin"));

router
 .route("/")
 .post(createImage);
router.route("/:id").patch(updateImage).delete(deleteImage);

export default router;
