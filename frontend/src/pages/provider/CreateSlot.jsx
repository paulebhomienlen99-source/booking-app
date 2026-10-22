import { useState, useEffect } from "react";
import {
  createSlot,
  getMyServices,
} from "../../api/provider";

import Layout from "../../components/Layout";

export default function CreateSlot() {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await getMyServices();

console.log(
  "SERVICES RESPONSE:",
  response.data
);

setServices(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadServices();
  }, []);

  async function handleCreate() {
    if (!serviceId) {
      alert("Seleziona un servizio");
      return;
    }

    await createSlot(
      serviceId,
      date,
      startTime,
      endTime
    );

    alert("Slot creato!");
  }

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">
        Crea Slot
      </h2>

      <select
        className="border p-2 w-full mb-3"
        value={serviceId}
        onChange={(e) =>
          setServiceId(e.target.value)
        }
      >
        <option value="">
          Seleziona un servizio
        </option>

      {services.map((service) => (
  <option
    key={service.id}
    value={service.id}
  >
    #{service.id} - {service.title} - €{service.price}
    {service.description
      ? ` - ${service.description}`
      : ""}
  </option>
))}
      </select>

      <input
        className="border p-2 w-full mb-3"
        type="date"
        onChange={(e) =>
          setDate(e.target.value)
        }
      />

      <input
        className="border p-2 w-full mb-3"
        type="time"
        onChange={(e) =>
          setStartTime(e.target.value)
        }
      />

      <input
        className="border p-2 w-full mb-3"
        type="time"
        onChange={(e) =>
          setEndTime(e.target.value)
        }
      />

      <button
        onClick={handleCreate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Crea Slot
      </button>
    </Layout>
  );
}