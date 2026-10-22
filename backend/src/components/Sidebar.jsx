import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed">
      <h2 className="text-2xl font-bold mb-8">Provider Panel</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/documents" className="hover:text-blue-400">Documenti</Link>
        <Link to="/listings" className="hover:text-blue-400">Servizi</Link>
        <Link to="/slots" className="hover:text-blue-400">Disponibilità</Link>
        <Link to="/reservations" className="hover:text-blue-400">Prenotazioni</Link>
      </nav>
    </div>
  );
}
