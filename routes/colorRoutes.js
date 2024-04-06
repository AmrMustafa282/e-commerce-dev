import express from "express";
const router = express.Router();

import { protect, restrictTo } from "./../controllers/authController.js";
import {
 getAllColors,
 getColor,
 updateColor,
 deleteColor,
 createColor,
} from "../controllers/colorController.js";


router.route("/").get(getAllColors);
router.route("/:id").get(getColor);

router.use(protect);
router.use(restrictTo("admin"));

router
 .route("/")
 .post(createColor);
router.route("/:id").patch(updateColor).delete(deleteColor);

export default router;
