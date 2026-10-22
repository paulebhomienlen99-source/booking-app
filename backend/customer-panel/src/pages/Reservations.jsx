import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Reservations() {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    api.get(`/customer/${customer.id}/reservations`)
      .then((res) => setReservations(res.data));
  }, []);

  return (
    <Layout>
      <h1 className="text-xl mb-4">Le Mie Prenotazioni</h1>

      {reservations.map((r) => (
        <div key={r.id} className="border p-3 mb-2">
          <p>Prenotazione #{r.id}</p>
          <p>Servizio: {r.listing_id}</p>
          <p>Data: {r.date}</p>
          <p>Ora: {r.time}</p>
        </div>
      ))}
    </Layout>
  );
}
