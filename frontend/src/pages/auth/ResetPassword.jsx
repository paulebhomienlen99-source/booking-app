import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const token =
    searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Le password non coincidono."
      );
      return;
    }

    try {
      const response =
        await fetch(
         `${API_BASE_URL}/auth/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              token,
              password,
            }),
          }
        );

      const text =
  await response.text();

console.log("RISPOSTA:", text);


      if (!response.ok) {
  throw new Error(text);
}

      setMessage(
        "Password aggiornata con successo."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">
        Reimposta Password
      </h1>

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="password"
          placeholder="Nuova password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border p-2 mb-3"
          required
        />

        <input
          type="password"
          placeholder="Conferma password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="w-full border p-2 mb-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Aggiorna Password
        </button>
      </form>

      {message && (
        <p className="text-green-600 mt-4">
          {message}
        </p>
      )}

      {error && (
        <p className="text-red-600 mt-4">
          {error}
        </p>
      )}
    </div>
  );
}