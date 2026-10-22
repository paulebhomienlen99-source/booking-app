import {
  createReservationService,
  cancelReservationService,
} from "../services/reservation.service.js";

export const createReservation = async (
  req,
  res
) => {
  try {
    const result =
      await createReservationService(
        req.body
      );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: error.message,
    });
  }
};

export const cancelReservation = async (
  req,
  res
) => {
  try {
    const result =
      await cancelReservationService(
        req.params.id
      );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      error: error.message,
    });
  }
};
