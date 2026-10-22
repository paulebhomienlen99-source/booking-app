import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Listings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    api.get("/admin/listings").then((res) => setListings(res.data));
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Servizi</h1>

      {listings.map((l) => (
        <div key={l.id} className="border p-3 mb-2">
          <p><strong>{l.title}</strong></p>
          <p>Provider: {l.provider_id}</p>
          <p>Prezzo: €{l.price}</p>
        </div>
      ))}
    </Layout>
  );
}
