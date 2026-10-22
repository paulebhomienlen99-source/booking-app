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
  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">
        Servizi Disponibili
      </h2>

      {services.map((s) => (
        <div
          key={s.id}
          className="p-4 bg-white shadow rounded mb-4"
        >
          <h3 className="text-lg font-bold">
            {s.title}
          </h3>

          <p>{s.description}</p>

<p className="text-yellow-600 font-semibold mt-2">
  ⭐ {s.average_rating}
  {" "}
  ({s.total_reviews} recensioni)
</p>

<p className="font-semibold">
  Prezzo: €{s.price}
</p>

          <button
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => loadSlots(s.id)}
          >
            Visualizza Slot
          </button>

          {slots[s.id]?.map((slot) => (
            <div
              key={slot.id}
              className="mt-3 p-3 border rounded"
            >
              <div>
  Data:{" "}
  {new Date(
    slot.slot_date
  ).toLocaleDateString("it-IT")}
</div>

              <div>
                {slot.start_time} - {slot.end_time}
              </div>

              <button
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                onClick={() =>
                  bookSlot(
                    s.id,
                    slot.id
                  )
                }
              >
                Prenota Slot
              </button>
            </div>
          ))}
        </div>
      ))}
    </Layout>
  );
}
