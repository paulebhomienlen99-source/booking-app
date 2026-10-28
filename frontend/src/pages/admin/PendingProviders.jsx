import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { API_BASE_URL } from "../../config/api";

export default function PendingProviders() {
  const [providers, setProviders] =
    useState([]);

  const loadProviders = async () => {
    try {
      const token =
        localStorage.getItem("adminToken");

      const res = await axios.get(
        `${API_BASE_URL}/admin/providers/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProviders(
        res.data.providers || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const approveProvider = async (
    id
  ) => {
    try {
      const token =
        localStorage.getItem("adminToken");

      await axios.put(
        `${API_BASE_URL}/admin/providers/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadProviders();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectProvider = async (
    id
  ) => {
    try {
      const token =
        localStorage.getItem("adminToken");

      await axios.put(
        `${API_BASE_URL}/admin/providers/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadProviders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">
        Provider da approvare
      </h2>

      {providers.length === 0 ? (
        <div className="bg-white p-6 rounded shadow">
          Nessun provider in attesa
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map(
            (provider) => (
              <div
                key={provider.id}
                className="bg-white p-6 rounded shadow"
              >
                <h3 className="text-xl font-bold">
                  {provider.name}
                </h3>

                <p className="mt-2">
                  📧 {provider.email}
                </p>

                <p>
                  📞 {provider.phone}
                </p>

                <p>
                  Stato: {provider.status}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      approveProvider(
                        provider.id
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    ✅ Approva
                  </button>

                  <button
                    onClick={() =>
                      rejectProvider(
                        provider.id
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    ❌ Rifiuta
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </Layout>
  );
}