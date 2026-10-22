import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold">Customer Panel</h1>

      <nav className="flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/services">Servizi</Link>
        <Link to="/reservations">Prenotazioni</Link>
      </nav>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
