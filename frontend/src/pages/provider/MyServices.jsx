import { useEffect, useState } from "react";
import {
  getMyServices,
  deleteService,
  updateService,
} from "../../api/provider";
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Vuoi eliminare questo servizio?"
    );

    if (!confirmDelete) return;

    try {
      await deleteService(id);

      setServices((prev) =>
        prev.filter(
          (service) => service.id !== id
        )
      );

      alert("Servizio eliminato!");
    } catch (error) {
      console.error(error);
      alert(
        "Errore durante l'eliminazione"
      );
    }
  };

  const handleEdit = async (service) => {
    const newTitle = prompt(
      "Titolo",
      service.title
    );

    if (!newTitle) return;

    const newDescription = prompt(
      "Descrizione",
      service.description
    );

    if (!newDescription) return;

    const newPrice = prompt(
      "Prezzo",
      service.price
    );

    if (!newPrice) return;

    try {
      await updateService(service.id, {
        title: newTitle,
        description: newDescription,
        price: newPrice,
      });

      alert("Servizio aggiornato!");

      loadServices();
    } catch (error) {
      console.error(error);
      alert(
        "Errore durante l'aggiornamento"
      );
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
                Stato{" "}
                {service.approved
                  ? "✅ Approvato"
                  : "⏳ In attesa"}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() =>
                    handleEdit(service)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  ✏️ Modifica
                </button>

                <button
                  onClick={() =>
                    handleDelete(service.id)
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  🗑️ Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}