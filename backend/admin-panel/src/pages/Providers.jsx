import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Providers() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    api.get("/admin/providers").then((res) => setProviders(res.data));
  }, []);

  const approve = async (id) => {
    await api.post(`/provider/approve/${id}`);
    alert("Provider approvato");
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Provider in attesa</h1>

      {providers.map((p) => (
        <div key={p.id} className="border p-3 mb-2">
          <p><strong>{p.business_name}</strong></p>
          <p>{p.description}</p>
          <button
            className="bg-green-600 text-white p-2 mt-2"
            onClick={() => approve(p.id)}
          >
            Approva
          </button>
        </div>
      ))}
    </Layout>
  );
}
