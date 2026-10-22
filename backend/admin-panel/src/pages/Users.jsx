import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Utenti</h1>

      {users.map((u) => (
        <div key={u.id} className="border p-3 mb-2">
          <p>Email: {u.email}</p>
          <p>Ruolo: {u.role}</p>
        </div>
      ))}
    </Layout>
  );
}
