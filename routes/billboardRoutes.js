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
} from "../controllers/billboardController.js";


router.route("/").get(getAllBillboards);
router.route("/:id").get(getBillboard);

router.use(protect);
router.use(restrictTo("admin"));

router.route("/").post(uploadBillboardPhoto,resizeBillboardPhoto,createBillboard);
router.route("/:id").patch(updateBillboard).delete(deleteBillboard);

export default router;
