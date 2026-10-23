import { useEffect, useState } from "react";
import {
  getProviderReviews,
  getProviderRating,
} from "../../api/reviews";

import Layout from "../../components/Layout";

export default function ProviderDashboard() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState({
    average_rating: 0,
    total_reviews: 0,
  });

  useEffect(() => {
    const providerId = 1;

    if (!providerId) return;

    getProviderReviews(providerId)
      .then((res) => {
        setReviews(res.data);
      })
      .catch(console.error);

    getProviderRating(providerId)
      .then((res) => {
        setRating(res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">
        Benvenuto Provider
      </h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">
            Documenti
          </h3>
          <p className="text-gray-600">
            Carica documenti per la verifica
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">
            Servizi
          </h3>
          <p className="text-gray-600">
            Crea nuovi servizi
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">
            Slot
          </h3>
          <p className="text-gray-600">
            Gestisci disponibilità
          </p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded shadow">
        <h3 className="text-xl font-bold mb-4">
          ⭐ Recensioni ricevute
        </h3>

        <p className="mb-4 text-lg font-semibold">
          Valutazione media:
          {" "}
          ⭐ {rating.average_rating}
          {" "}
          ({rating.total_reviews} recensioni)
        </p>

        {reviews.length === 0 ? (
          <p>Nessuna recensione ricevuta.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded p-3 mb-3"
            >
              <p>
                {"⭐".repeat(
                  review.rating
                )}
              </p>

              <p className="mt-2">
                {review.comment}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Cliente:
                {" "}
                {review.customer_name}
              </p>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}