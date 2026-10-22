import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Documents() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    api.get("/admin/documents").then((res) => setDocs(res.data));
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Documenti Provider</h1>

      {docs.map((d) => (
        <div key={d.id} className="border p-3 mb-2">
          <p>Provider ID: {d.provider_id}</p>
          <p>File: {d.file_path}</p>
          <p>Status: {d.status}</p>
        </div>
      ))}
    </Layout>
  );
}
