import { useState } from "react";
import Layout from "../../components/Layout";
import { createProviderProfile } from "../../api/provider";

export default function ProviderSetup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await createProviderProfile(
        name,
        phone
      );

      alert(
        "Profilo Provider salvato con successo"
      );

      setName("");
      setPhone("");
    } catch (error) {
      console.error(error);

      alert(
        "Errore durante il salvataggio del profilo"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">
        Completa Profilo Provider
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-lg"
      >
        <input
          type="text"
          placeholder="Nome completo"
          className="w-full border p-3 mb-4 rounded"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="Telefono"
          className="w-full border p-3 mb-4 rounded"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading
            ? "Salvataggio..."
            : "Salva Profilo"}
        </button>
      </form>
    </Layout>
  );
}