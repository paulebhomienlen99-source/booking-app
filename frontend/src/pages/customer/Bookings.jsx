import { useEffect, useState } from "react";
import { getMyBookings } from "../../api/customer";
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

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">
        Le mie prenotazioni
      </h2>

      {bookings.length === 0 && (
        <div className="p-4 bg-white rounded shadow">
          Nessuna prenotazione trovata
        </div>
      )}

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm mb-4"
        >
          <h3 className="text-xl font-bold mb-2">
            {booking.service_title}
          </h3>

          <p>
            📅{" "}
            {new Date(
              booking.slot_date
            ).toLocaleDateString("it-IT")}
          </p>

          <p>
            🕒 {booking.start_time} -{" "}
            {booking.end_time}
          </p>

          <p>
            👤 Provider:{" "}
            {booking.provider_name}
          </p>

          <div className="mt-3">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800">
              {booking.status}
            </span>
          </div>

          <div className="mt-4 border-t pt-4">
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
                <h4 className="font-semibold mb-2">
                  ⭐ Lascia una recensione
                </h4>

                <select
                  className="border p-2 rounded w-full mb-2"
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
                  className="border p-2 rounded w-full mb-2"
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
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Invia recensione
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </Layout>
  );
}