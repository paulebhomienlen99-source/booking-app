import { useEffect, useState } from "react";
import { getProviderBookings } from "../../api/provider";
import Layout from "../../components/Layout";

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getProviderBookings()
      .then((res) => {
        setBookings(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">
        Prenotazioni Ricevute
      </h2>

      {bookings.length === 0 && (
        <div className="p-4 bg-white rounded shadow">
          Nessuna prenotazione ricevuta
        </div>
      )}

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 mb-4"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            🏠 {booking.service_title}
          </h3>

          <hr className="mb-4 border-gray-200" />

          <p className="mb-2">
            👤 Cliente: {booking.customer_email}
          </p>

          <p className="mb-2">
            📅 Data:{" "}
            {new Date(
              booking.slot_date
            ).toLocaleDateString("it-IT")}
          </p>

          <p className="mb-3">
            🕒 Orario: {booking.start_time} - {booking.end_time}
          </p>

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
            ✅ Confermata
          </span>
        </div>
      ))}
    </Layout>
  );
}