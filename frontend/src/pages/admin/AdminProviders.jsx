// frontend/src/pages/admin/AdminProviders.jsx

import { useEffect, useState } from "react";
import {
  getPendingProviders,
  approveProvider,
} from "../../api/admin";

export default function AdminProviders() {
  const [providers, setProviders] = useState([]);

  const loadProviders = async () => {
    try {
      const data = await getPendingProviders();
      setProviders(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveProvider(id);
      loadProviders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏢 Provider in Attesa</h1>

      <div
        style={{
          marginTop: "20px",
          background: "#1e293b",
          color: "#fff",
          borderRadius: "10px",
          padding: "20px",
          border: "1px solid #334155",
        }}
      >
        <h3>
          Provider da approvare: {providers.length}
        </h3>
      </div>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          background: "#1e293b",
          color: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "12px",
                textAlign: "left",
              }}
            >
              ID
            </th>

            <th
              style={{
                padding: "12px",
                textAlign: "left",
              }}
            >
              Nome
            </th>

            <th
              style={{
                padding: "12px",
                textAlign: "left",
              }}
            >
              Azioni
            </th>
          </tr>
        </thead>

        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td
                style={{
                  padding: "12px",
                  borderTop: "1px solid #334155",
                }}
              >
                {provider.id}
              </td>

              <td
                style={{
                  padding: "12px",
                  borderTop: "1px solid #334155",
                }}
              >
                {provider.business_name ||
                  provider.name}
              </td>

              <td
                style={{
                  padding: "12px",
                  borderTop: "1px solid #334155",
                }}
              >
                <button
                  onClick={() =>
                    handleApprove(provider.id)
                  }
                  style={{
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  ✅ Approva
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}