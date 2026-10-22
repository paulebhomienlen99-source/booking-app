import { useState } from "react";
import api from "../api/axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function AnalyticsPro() {
  const [filters, setFilters] = useState({});
  const [result, setResult] = useState(null);

  const applyFilters = async () => {
    const res = await api.get("/admin/analytics", { params: filters });
    setResult(res.data);
  };

  const exportPDF = () => {
    window.open("http://localhost:3000/api/admin/export/pdf");
  };

  const sendEmail = async () => {
    await api.post("/admin/notify/top-providers");
    alert("Email inviate ai provider top!");
  };

  const revenueChart = result
    ? {
        labels: result.revenueByDay.map((d) => d.day),
        datasets: [
          {
            label: "Ricavi filtrati (€)",
            data: result.revenueByDay.map((d) => d.revenue),
            backgroundColor: "rgba(75, 192, 192, 0.6)"
          }
        ]
      }
    : null;

  const compareChart = result
    ? {
        labels: ["Prima", "Dopo filtro"],
        datasets: [
          {
            label: "Ricavi (€)",
            data: [result.originalRevenue, result.revenue],
            backgroundColor: ["gray", "blue"]
          }
        ]
      }
    : null;

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">Analytics Pro</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <input type="date" className="border p-2" onChange={(e) => setFilters({ ...filters, date_from: e.target.value })} />
        <input type="date" className="border p-2" onChange={(e) => setFilters({ ...filters, date_to: e.target.value })} />
        <input type="number" placeholder="Provider ID" className="border p-2" onChange={(e) => setFilters({ ...filters, provider_id: e.target.value })} />
        <input type="text" placeholder="Categoria" className="border p-2" onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
        <input type="number" placeholder="Min prezzo" className="border p-2" onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} />
        <input type="number" placeholder="Max prezzo" className="border p-2" onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={applyFilters}>
        Applica filtri
      </button>

      <button className="bg-green-600 text-white px-4 py-2 rounded ml-4" onClick={exportPDF}>
        Esporta PDF
      </button>

      <button className="bg-purple-600 text-white px-4 py-2 rounded ml-4" onClick={sendEmail}>
        Invia Email Provider Top
      </button>

      {result && (
        <div className="mt-6">
          <div className="bg-white p-4 shadow rounded mb-6">
            <h2 className="text-xl mb-4">Ricavi filtrati</h2>
            <Line data={revenueChart} />
          </div>

          <div className="bg-white p-4 shadow rounded mb-6">
            <h2 className="text-xl mb-4">Comparazione ricavi</h2>
            <Bar data={compareChart} />
          </div>
        </div>
      )}
    </div>
  );
}

