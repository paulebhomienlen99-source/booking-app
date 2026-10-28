import { useEffect, useState } from "react";
import {
  getMyBookings,
  cancelBooking,
} from "../../api/customer";
import {
  createReview,
  getReviewByReservation,
} from "../../api/reviews";
import Layout from "../../components/Layout";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState({});

  useEffect(() => {
  getMyBookings()
    .then((res) => {

      console.log(
        "BOOKINGS RESPONSE:",
        res.data
      );

      setBookings(res.data);

        res.data.forEach(async (booking) => {
          try {
            const review =
              await getReviewByReservation(
                booking.id
              );

            if (review.data) {
              setReviews((prev) => ({
                ...prev,
                [booking.id]: review.data,
              }));
            }
          } catch (error) {
            console.error(error);
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  async function handleReview(booking) {
  try {
    await createReview({
      reservation_id: booking.id,
      provider_id: booking.provider_id,
      rating,
      comment,
    });

    alert("✅ Recensione inviata con successo");

    setRating(5);
    setComment("");

    const review =
      await getReviewByReservation(
        booking.id
      );

    if (review.data) {
      setReviews((prev) => ({
        ...prev,
        [booking.id]: review.data,
      }));
    }
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.error ||
      "Errore durante l'invio della recensione"
    );
  }
}

async function handleCancel(id) {
  try {
    await cancelBooking(id);

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: "cancelled",
            }
          : booking
      )
    );

    alert("✅ Prenotazione annullata");
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.error ||
      "Errore annullamento prenotazione"
    );
  }
}

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">
        Le mie prenotazioni
      </h2>

      {bookings.length === 0 && (
        <div className="p-4 bg-white rounded shadow">
          Nessuna prenotazione trovata
        </div>
      )}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

  {bookings.map((booking) => (
    <div
      key={booking.id}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-5 flex flex-col h-full"
    >
      <h3 className="text-xl font-bold mb-3">
        {booking.service_title}
      </h3>

      <p className="mb-1">
        📅{" "}
        {new Date(
          booking.slot_date
        ).toLocaleDateString("it-IT")}
      </p>

      <p className="mb-1">
        🕒 {booking.start_time} - {booking.end_time}
      </p>

      <p className="mb-3">
        👤 Provider: {booking.provider_name}
      </p>

      <div className="mt-2 flex flex-col gap-3">
        <span
          className={
            booking.status === "cancelled"
              ? "inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-center"
              : "inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-center"
          }
        >
          {booking.status}
        </span>

        {booking.status !== "cancelled" && (
          <button
            onClick={() =>
              handleCancel(booking.id)
            }
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition"
          >
            ❌ Annulla Prenotazione
          </button>
        )}
      </div>

      <div className="mt-5 border-t pt-4">
        {reviews[booking.id] ? (
          <div>
            <p className="text-green-600 font-semibold mb-2">
              ✅ Recensione già inviata
            </p>

            <p>
              {"⭐".repeat(
                reviews[booking.id].rating
              )}
            </p>

            <p className="mt-2">
              {reviews[booking.id].comment}
            </p>
          </div>
        ) : (
          <>
            <h4 className="font-semibold mb-3">
              ⭐ Lascia una recensione
            </h4>

            <select
              className="border p-2 rounded w-full mb-3"
              value={rating}
              onChange={(e) =>
                setRating(
                  Number(e.target.value)
                )
              }
            >
              <option value={5}>
                ⭐⭐⭐⭐⭐ (5)
              </option>

              <option value={4}>
                ⭐⭐⭐⭐ (4)
              </option>

              <option value={3}>
                ⭐⭐⭐ (3)
              </option>

              <option value={2}>
                ⭐⭐ (2)
              </option>

              <option value={1}>
                ⭐ (1)
              </option>
            </select>

            <textarea
              className="border p-2 rounded w-full mb-3"
              placeholder="Scrivi una recensione..."
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
            />

            <button
              onClick={() =>
                handleReview(booking)
              }
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition shadow-md"
            >
              Invia Recensione
            </button>
          </>
        )}
      </div>
    </div>
  ))}

</div>
    </Layout>
  );
}