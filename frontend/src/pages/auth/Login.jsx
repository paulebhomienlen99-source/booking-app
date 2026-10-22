import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(email, password);

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data.token) {
        setError("");

        const role =
          res.data.user?.role || "customer";

        localStorage.setItem(
  "token",
  res.data.token
);

localStorage.setItem(
  "role",
  role
);

localStorage.setItem(
  "userId",
  res.data.user.id
);

        if (role === "admin") {
          navigate("/admin");
        } else if (role === "provider") {
          navigate("/provider");
        } else {
          navigate("/customer");
        }
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-6">
          Login
        </h1>

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

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
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}