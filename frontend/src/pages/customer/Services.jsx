import { useEffect, useState } from "react";
import {
  getAllServices,
  getServiceSlots,
} from "../../api/customer";

import {
  createOrder,
} from "../../api/payments";
import Layout from "../../components/Layout";

export default function Services() {
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState({});
const [search, setSearch] = useState("");
const [maxPrice, setMaxPrice] = useState("");
const [minRating, setMinRating] = useState("");

  useEffect(() => {
    getAllServices()
      .then((res) => {
        setServices(res.data);
      })
      .catch(console.error);
  }, []);

  async function loadSlots(serviceId) {
    try {
      const response =
        await getServiceSlots(serviceId);

      setSlots((prev) => ({
        ...prev,
        [serviceId]: response.data,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  async function bookSlot(
  serviceId,
  slotId
) {
  try {
    const response =
      await createOrder(
        Number(serviceId),
        Number(slotId)
      );

    if (
      response.data.approvalUrl
    ) {
      window.location.href =
        response.data.approvalUrl;
      return;
    }

    alert(
      "URL PayPal non disponibile"
    );
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.error ||
      "Errore durante la creazione del pagamento"
    );
  }
}
 const filteredServices = services.filter(
  (service) =>
    service.title
      .toLowerCase()
      .includes(search.toLowerCase()) &&
    (maxPrice === "" ||
      Number(service.price) <= Number(maxPrice)) &&
    (minRating === "" ||
      Number(service.average_rating) >=
        Number(minRating))
);
return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">

  Servizi Disponibili
</h2>

<div className="bg-white shadow rounded p-4 mb-6">
  <div className="grid md:grid-cols-3 gap-4">

    <input
      type="text"
      placeholder="🔍 Cerca servizio..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="border p-2 rounded"
    />

    <input
      type="number"
      placeholder="💰 Prezzo massimo"
      value={maxPrice}
      onChange={(e) =>
        setMaxPrice(e.target.value)
      }
      className="border p-2 rounded"
    />

    <select
      value={minRating}
      onChange={(e) =>
        setMinRating(e.target.value)
      }
      className="border p-2 rounded"
    >
      <option value="">
        ⭐ Rating minimo
      </option>

      <option value="1">1+</option>
      <option value="2">2+</option>
      <option value="3">3+</option>
      <option value="4">4+</option>
      <option value="5">5</option>
    </select>

  </div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

  {filteredServices.map((s) => (
    <div
  key={s.id}
  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition flex flex-col"
>
      {s.image_url ? (
        <img
          src={s.image_url}
          alt={s.title}
          className="w-full h-64 object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          Nessuna immagine
        </div>
      )}

      <div className="p-5 flex flex-col h-full justify-between">

        <h3 className="text-xl font-bold">
          {s.title}
        </h3>

        <p className="text-gray-600 mt-2">
          {s.description}
        </p>

        <p className="text-yellow-600 font-semibold mt-3">
          ⭐ {s.average_rating} ({s.total_reviews} recensioni)
        </p>

        <p className="text-2xl font-bold text-green-600 mt-2">
          €{s.price}
        </p>

       <button
  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition shadow-md"
  onClick={() => loadSlots(s.id)}
>
  Visualizza Slot
</button>

        {slots[s.id]?.map((slot) => (
  <div
  key={slot.id}
  className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition hover:border-green-400"
>
    <div className="flex items-center gap-2 text-gray-700">
      <span>📅</span>
      <span className="font-medium">
        {new Date(
          slot.slot_date
        ).toLocaleDateString("it-IT")}
      </span>
    </div>

    <div className="flex items-center gap-2 text-gray-700 mt-2">
      <span>🕒</span>
      <span>
        {slot.start_time} - {slot.end_time}
      </span>
    </div>

    <div className="mt-3">
      <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
        Disponibile
      </span>
    </div>

    <button
      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
      onClick={() =>
        bookSlot(
          s.id,
          slot.id
        )
      }
    >
      Prenota Ora
    </button>
  </div>
))}
      </div>
    </div>
  ))}

</div>

    </Layout>
  );
}