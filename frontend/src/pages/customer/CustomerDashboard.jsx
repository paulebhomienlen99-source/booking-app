import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { API_BASE_URL } from "../../config/api";

export default function CustomerDashboard() {
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0,
    totalReviews: 0,
  });

  const [reservations, setReservations] =
    useState([]);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user?.id) return;

    axios
      .get(
        `${API_BASE_URL.replace(
          "/api",
          ""
        )}/api/customers/${user.id}/analytics`
      )
      .then((res) => {
        setAnalytics(res.data);

        return axios.get(
          `${API_BASE_URL.replace(
            "/api",
            ""
          )}/api/customers/${user.id}/reservations`
        );
      })
      .then((res) => {
        setReservations(res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">
        Dashboard Cliente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-gray-500">
            📦 Prenotazioni Totali
          </h3>

          <p className="text-4xl font-bold mt-2">
            {analytics.totalBookings}
          </p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h3 className="text-gray-500">
            ✅ Completate
          </h3>

          <p className="text-4xl font-bold text-green-600 mt-2">
            {analytics.completedBookings}
          </p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h3 className="text-gray-500">
            ❌ Cancellate
          </h3>

          <p className="text-4xl font-bold text-red-600 mt-2">
            {analytics.cancelledBookings}
          </p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h3 className="text-gray-500">
            💰 Totale Speso
          </h3>

          <p className="text-4xl font-bold text-green-600 mt-2">
            € {analytics.totalSpent}
          </p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h3 className="text-gray-500">
            ⭐ Recensioni Lasciate
          </h3>

          <p className="text-4xl font-bold text-yellow-500 mt-2">
            {analytics.totalReviews}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6 mt-8">
        <h3 className="text-xl font-bold mb-4">
          📋 Ultime Prenotazioni
        </h3>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">
                Servizio
              </th>

              <th className="text-left p-2">
                Provider
              </th>

              <th className="text-left p-2">
                Stato
              </th>

              <th className="text-left p-2">
                Data
              </th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((r) => (
              <tr
                key={r.id}
                className="border-b"
              >
                <td className="p-2">
                  {r.service_title}
                </td>

                <td className="p-2">
                  {r.provider_name}
                </td>

                <td className="p-2">
  <span
    className={`px-3 py-1 rounded-full text-sm font-semibold ${
      r.status === "confirmed"
        ? "bg-green-100 text-green-700"
        : r.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {r.status}
  </span>
</td>

                <td className="p-2">
                  {r.slot_date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}