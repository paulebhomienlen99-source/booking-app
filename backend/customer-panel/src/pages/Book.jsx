import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Book() {
  const { id } = useParams();
  const customer = JSON.parse(localStorage.getItem("customer"));
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    api.get(`/customer/slots/${id}`).then((res) => setSlots(res.data));
  }, []);

  const book = async (slotId, providerId) => {
    await api.post("/reservations/create", {
      customer_id: customer.id,
      provider_id: providerId,
      listing_id: id,
      slot_id: slotId
    });

    alert("Prenotazione completata");
  };

  return (
    <Layout>
      <h1 className="text-xl mb-4">Disponibilità</h1>

      {slots.map((s) => (
        <div key={s.id} className="border p-3 mb-2">
          <p>{s.start_time} → {s.end_time}</p>
          <button
            className="bg-green-600 text-white p-2 mt-2"
            onClick={() => book(s.id, s.provider_id)}
          >
            Prenota
          </button>
        </div>
      ))}
    </Layout>
  );
}
