import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await api.post("/auth/register", {
      email,
      password,
      role: "customer"
    });
    alert("Registrazione completata");
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 shadow rounded w-80">
        <h1 className="text-xl mb-4">Registrati</h1>

        <input className="border p-2 w-full mb-3" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />

        <input className="border p-2 w-full mb-3" placeholder="Password" type="password"
          onChange={(e) => setPassword(e.target.value)} />

        <button className="bg-blue-600 text-white p-2 w-full" onClick={register}>
          Registrati
        </button>
      </div>
    </div>
  );
}
