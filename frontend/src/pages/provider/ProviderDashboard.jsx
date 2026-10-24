import { useEffect, useState } from "react";
import {
  getProviderReviews,
  getProviderRating,
} from "../../api/reviews";
import { getProviderAnalytics }
  from "../../api/provider";
import Layout from "../../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
export default function ProviderDashboard() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState({
    average_rating: 0,
    total_reviews: 0,
  });
const [analytics, setAnalytics] =
  useState({
    totalBookings: 0,
    cancelledBookings: 0,
    totalReviews: 0,
    averageRating: 0,
    totalRevenue: 0,
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
  getProviderAnalytics()
  .then((res) => {
    setAnalytics(res.data);
  })
  .catch(console.error);
    }, []);
const chartData = [
  {
    name: "Prenotazioni",
    valore: analytics.totalBookings,
  },
  {
    name: "Cancellate",
    valore: analytics.cancelledBookings,
  },
];
  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">
        Benvenuto Provider
      </h2>
<div className="grid grid-cols-5 gap-4 mb-8">

  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-bold">
      📦 Prenotazioni
    </h3>

    <p className="text-2xl mt-2">
      {analytics.totalBookings}
    </p>
  </div>

  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-bold">
      ❌ Cancellate
    </h3>

    <p className="text-2xl mt-2">
      {analytics.cancelledBookings}
    </p>
  </div>

  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-bold">
      ⭐ Recensioni
    </h3>

    <p className="text-2xl mt-2">
      {analytics.totalReviews}
    </p>
  </div>

  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-bold">
      📈 Rating
    </h3>

    <p className="text-2xl mt-2">
      {analytics.averageRating}
    </p>
  </div>

  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-bold">
      💰 Entrate
    </h3>

    <p className="text-2xl mt-2">
      € {analytics.totalRevenue}
    </p>
  </div>

</div>

<div className="bg-white p-6 rounded shadow mb-8">
  <h3 className="text-xl font-bold mb-4">
    📊 Andamento prenotazioni
  </h3>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <BarChart data={chartData}>
      <CartesianGrid
        strokeDasharray="3 3"
      />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar
  dataKey="valore"
  radius={[8, 8, 0, 0]}
  fill="#2563eb"
/>
    </BarChart>
  </ResponsiveContainer>
</div>

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