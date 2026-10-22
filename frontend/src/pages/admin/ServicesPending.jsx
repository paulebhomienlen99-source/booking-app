import { useEffect, useState } from "react";
import {
  getPendingServices,
  approveService,
} from "../../api/admin";
import Layout from "../../components/Layout";

export default function ServicesPending() {
  const [services, setServices] = useState([]);

  const loadServices = async () => {
    try {
      const data = await getPendingServices();

      setServices(data.services || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveService(id);

      loadServices();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">
        Servizi in attesa
      </h2>

      {services.length === 0 ? (
        <p>Nessun servizio in attesa</p>
      ) : (
        services.map((service) => (
          <div
            key={service.id}
            className="p-4 bg-white shadow rounded mb-4"
          >
            <h3 className="text-lg font-bold">
              {service.title}
            </h3>

            <p>{service.description}</p>

            <p>
              Prezzo: €{service.price}
            </p>

            <p>
              Stato: {service.status}
            </p>

            <button
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
              onClick={() =>
                handleApprove(service.id)
              }
            >
              Approva
            </button>
          </div>
        ))
      )}
    </Layout>
  );
}
