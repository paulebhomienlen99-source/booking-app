import { useEffect, useState } from "react";
import { getMyServices } from "../../api/provider";
import Layout from "../../components/Layout";

export default function MyServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await getMyServices();
      setServices(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">
        🛠 I Miei Servizi
      </h2>

      {services.length === 0 ? (
        <div className="bg-white p-4 rounded shadow">
          Nessun servizio creato.
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded shadow"
            >
              <h3 className="text-xl font-bold">
                {service.title}
              </h3>

              <p className="mt-2">
                {service.description}
              </p>

              <p className="mt-2">
                💰 € {service.price}
              </p>

              <p className="mt-2">
                Stato:
                {" "}
                {service.approved
                  ? "✅ Approvato"
                  : "⏳ In attesa"}
              </p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}