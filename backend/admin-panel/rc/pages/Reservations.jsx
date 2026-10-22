import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    api.get("/admin/reservations").then((res) => setReservations(res.data));
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Prenotazioni</h1>

      {reservations.map((r) => (
        <div key={r.id} className="border p-3 mb-2">
          <p>Prenotazione #{r.id}</p>
          <p>Cliente: {r.customer_id}</p>
          <p>Provider: {r.provider_id}</p>
          <p>Servizio: {r.listing_id}</p>
        </div>
      ))}
    </Layout>
  );
}
