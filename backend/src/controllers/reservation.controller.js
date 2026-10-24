import {
  createReservationService,
  cancelReservationService,
  getMyReservationsService,
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
    console.error(
      "RESERVATION ERROR:",
      error
    );

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
    console.error(
      "CANCEL RESERVATION ERROR:",
      error
    );

    res.status(400).json({
      error: error.message,
    });
  }
};

export const getMyReservations =
  async (req, res) => {
    try {
      const result =
        await getMyReservationsService(
          req.user.id
        );

      res.json(result);
    } catch (error) {
      console.error(
        "MY RESERVATIONS ERROR:",
        error
      );

      res.status(500).json({
        error:
          "Errore recupero prenotazioni",
      });
    }
  };