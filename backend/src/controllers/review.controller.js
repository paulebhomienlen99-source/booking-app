import {
  createReviewService,
  getProviderReviewsService,
  getProviderAverageRatingService,
  getReviewByReservationService,
} from "../services/review.service.js";

export const createReview = async (
  req,
  res
) => {
  try {
    const {
      reservation_id,
      provider_id,
      rating,
      comment,
    } = req.body;

    const review =
      await createReviewService({
        reservation_id,
        customer_id: req.user.id,
        provider_id,
        rating,
        comment,
      });

    res.json(review);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getProviderReviews =
  async (req, res) => {
    try {
      const reviews =
        await getProviderReviewsService(
          req.params.providerId
        );

      res.json(reviews);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };

export const getProviderRating =
  async (req, res) => {
    try {
      const rating =
        await getProviderAverageRatingService(
          req.params.providerId
        );

      res.json(rating);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };
  export const getReviewByReservation =
  async (req, res) => {
    try {
      const review =
        await getReviewByReservationService(
          req.params.reservationId
        );

      res.json(review);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };