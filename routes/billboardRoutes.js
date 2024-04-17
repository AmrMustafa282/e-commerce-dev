import express from "express";
const router = express.Router();

import { protect, restrictTo } from "./../controllers/authController.js";
import {
  getAllBillboards,
  getBillboard,
  updateBillboard,
  deleteBillboard,
  createBillboard,
  uploadBillboardPhoto,
  resizeBillboardPhoto,
  getFeaturedBillboard,
} from "../controllers/billboardController.js";

router.route("/").get(getAllBillboards);
router.route("/featured").get(getFeaturedBillboard);
router.route("/:id").get(getBillboard);

router.use(protect);
router.use(restrictTo("admin"));

router
  .route("/")
  .post(uploadBillboardPhoto, resizeBillboardPhoto, createBillboard);
router
  .route("/:id")
  .patch(uploadBillboardPhoto, resizeBillboardPhoto, updateBillboard)
  .delete(deleteBillboard);

export default router;
