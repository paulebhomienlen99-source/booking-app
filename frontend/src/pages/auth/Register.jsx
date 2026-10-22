import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await register(
        "User",
        email,
        password,
        role
      );

      alert("Registrazione completata");

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Errore registrazione");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-6">
          Registrazione
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <select
          className="w-full border p-2 mb-4 rounded"
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option value="customer">
            Customer
          </option>

          <option value="provider">
            Provider
          </option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Registrati
        </button>
      </form>
    </div>
  );
}