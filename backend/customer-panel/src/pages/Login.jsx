import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await api.post("/auth/login", { email, password });

    if (res.data.role !== "customer") {
      alert("Non sei un cliente");
      return;
    }

    localStorage.setItem("customer", JSON.stringify(res.data));
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 shadow rounded w-80">
        <h1 className="text-xl mb-4">Login Cliente</h1>

        <input className="border p-2 w-full mb-3" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />

        <input className="border p-2 w-full mb-3" placeholder="Password" type="password"
          onChange={(e) => setPassword(e.target.value)} />

        <button className="bg-green-600 text-white p-2 w-full" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}
