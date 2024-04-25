import express from "express";
const router = express.Router();

import { protect } from "./../controllers/authController.js";

import {
 createReview,
 deleteReview,
 getAllReviewsOfProduct,
 updateReview,
 upvote,
} from "../controllers/reviewsController.js";

router.route("/:id").get(getAllReviewsOfProduct); // id of product

router.use(protect);
router.route("/:id").put(upvote); // id of review & put for unconfilict

router.route("/:id").post(createReview); // id of a product
router.route("/:id").patch(updateReview).delete(deleteReview); // id of the review

export default router;
