import { useEffect, useState } from "react";

import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
} from "../../api/admin";

import Layout from "../../components/Layout";

export default function ProvidersPending() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data =
        await getPendingProviders();

      if (data.success) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (
    id
  ) => {
    try {
      await approveProvider(id);

      alert(
        "Provider approvato con successo"
      );

      loadProviders();
    } catch (error) {
      console.error(error);

      alert(
        "Errore durante approvazione"
      );
    }
  };

  const handleReject = async (
    id
  ) => {
    try {
      await rejectProvider(id);

      alert(
        "Provider rifiutato"
      );

      loadProviders();
    } catch (error) {
      console.error(error);

      alert(
        "Errore durante rifiuto"
      );
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">
        Provider in Attesa
      </h2>

      {providers.length === 0 ? (
        <div className="bg-white p-4 rounded shadow">
          Nessun provider in attesa.
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map(
            (provider) => (
              <div
                key={provider.id}
                className="bg-white p-6 rounded shadow"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>ID:</strong>{" "}
                    {provider.id}
                  </div>

                  <div>
                    <strong>
                      Status:
                    </strong>{" "}
                    {
                      provider.provider_status
                    }
                  </div>

                  <div>
                    <strong>
                      Nome:
                    </strong>{" "}
                    {provider.name ||
                      "-"}
                  </div>

                  <div>
                    <strong>
                      Email:
                    </strong>{" "}
                    {provider.email}
                  </div>

                  <div>
                    <strong>
                      Telefono:
                    </strong>{" "}
                    {provider.phone ||
                      "-"}
                  </div>

                  <div>
                    <strong>
                      Documento:
                    </strong>{" "}
                    {provider.document_path ? (
                      <a
                        href={
                          provider.document_path
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Apri Documento
                      </a>
                    ) : (
                      <span className="text-red-600">
                        Non caricato
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
  onClick={() =>
    handleApprove(
      provider.id
    )
  }
  disabled={!provider.document_path}
  className={`px-4 py-2 rounded text-white ${
    provider.document_path
      ? "bg-green-600 hover:bg-green-700"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  Approva
</button>
                  <button
                    onClick={() =>
                      handleReject(
                        provider.id
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Rifiuta
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
