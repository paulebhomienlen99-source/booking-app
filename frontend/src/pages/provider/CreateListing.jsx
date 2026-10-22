import { useState } from "react";
import { createListing } from "../../api/provider";
import Layout from "../../components/Layout";

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  async function handleCreate() {
    try {
      await createListing(
        title,
        description,
        price
      );

      alert("Servizio creato!");

      setTitle("");
      setDescription("");
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Errore nella creazione del servizio");
    }
  }

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">
        Crea Servizio
      </h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Titolo"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Descrizione"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Prezzo"
        type="number"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
      />

      <button
        onClick={handleCreate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Crea
      </button>
    </Layout>
  );
}
