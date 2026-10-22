import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/customer/services").then((res) => setServices(res.data));
  }, []);

  return (
    <Layout>
      <h1 className="text-xl mb-4">Servizi Disponibili</h1>

      {services.map((s) => (
        <div key={s.id} className="border p-3 mb-2">
          <h3 className="text-lg font-bold">{s.title}</h3>
          <p>Prezzo: €{s.price}</p>

          <button
            className="bg-blue-600 text-white p-2 mt-2"
            onClick={() => window.location.href = `/book/${s.id}`}
          >
            Prenota
          </button>
        </div>
      ))}
    </Layout>
  );
}
