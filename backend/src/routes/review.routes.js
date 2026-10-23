import express from "express";
import { auth } from "../middleware/auth.js";

import {
  createReview,
  getProviderReviews,
  getProviderRating,
  getReviewByReservation,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post(
  "/",
  auth,
  createReview
);

router.get(
  "/provider/:providerId",
  getProviderReviews
);

router.get(
  "/provider/:providerId/rating",
  getProviderRating
);

router.get(
  "/reservation/:reservationId",
  getReviewByReservation
);

export default router;
