import { useState } from "react";
import { uploadDocument } from "../../api/provider";
import Layout from "../../components/Layout";

export default function UploadDocument() {
  const [file, setFile] = useState(null);

  async function handleUpload() {
    if (!file) return alert("Seleziona un file");
    await uploadDocument(file);
    alert("Documento caricato!");
  }

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Carica Documento</h2>

      <input
        type="file"
        className="mb-4"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Carica
      </button>
    </Layout>
  );
}

