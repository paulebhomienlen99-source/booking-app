import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <Layout>Caricamento...</Layout>;

  // ============================
  //   GRAFICO PRENOTAZIONI
  // ============================
  const reservationsData = {
    labels: stats.reservationsByDay.map((r) => r.day),
    datasets: [
      {
        label: "Prenotazioni per giorno",
        data: stats.reservationsByDay.map((r) => r.count),
        borderColor: "blue",
        backgroundColor: "lightblue"
      }
    ]
  };

  // ============================
  //   GRAFICO PROVIDER
  // ============================
  const providerData = {
    labels: ["Approvati", "In attesa"],
    datasets: [
      {
        label: "Provider",
        data: [stats.approvedProviders, stats.pendingProviders],
        backgroundColor: ["green", "orange"]
      }
    ]
  };

  // ============================
  //   GRAFICO RICAVI GIORNALIERI
  // ============================
  const revenueData = {
    labels: stats.revenueByDay.map((r) => r.day),
    datasets: [
      {
        label: "Ricavi giornalieri (€)",
        data: stats.revenueByDay.map((r) => r.revenue),
        borderColor: "green",
        backgroundColor: "lightgreen"
      }
    ]
  };

  // ============================
  //   GRAFICO RICAVI MENSILI
  // ============================
  const revenueMonthData = {
    labels: stats.revenueByMonth.map((m) => m.month),
    datasets: [
      {
        label: "Ricavi mensili (€)",
        data: stats.revenueByMonth.map((m) => m.revenue),
        backgroundColor: "orange"
      }
    ]
  };

  // ============================
  //   GRAFICO RICAVI ANNUALI
  // ============================
  const revenueYearData = {
    labels: stats.revenueByYear.map((y) => y.year),
    datasets: [
      {
        label: "Ricavi annuali (€)",
        data: stats.revenueByYear.map((y) => y.revenue),
        backgroundColor: "purple"
      }
    ]
  };

  // ============================
  //   GRAFICO RICAVI PER PROVIDER
  // ============================
  const revenueProviderData = {
    labels: stats.revenueByProvider.map((p) => p.business_name),
    datasets: [
      {
        label: "Ricavi per provider (€)",
        data: stats.revenueByProvider.map((p) => p.revenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  // ============================
  //   GRAFICO RICAVI PER SERVIZIO (TOP 10)
  // ============================
  const revenueServiceData = {
    labels: stats.revenueByService.map((s) => s.title),
    datasets: [
      {
        label: "Ricavi per servizio (€)",
        data: stats.revenueByService.map((s) => s.revenue),
        backgroundColor: "rgba(255, 159, 64, 0.6)"
      }
    ]
  };

  // ============================
  //   GRAFICO RICAVI PER CATEGORIA
  // ============================
  const revenueCategoryData = {
    labels: stats.revenueByCategory.map((c) => c.category),
    datasets: [
      {
        label: "Ricavi per categoria (€)",
        data: stats.revenueByCategory.map((c) => c.revenue),
        backgroundColor: "rgba(153, 102, 255, 0.6)"
      }
    ]
  };

  // ============================
  //   GRAFICO RICAVI PER FASCIA ORARIA
  // ============================
  const revenueHourData = {
    labels: stats.revenueByHour.map((h) => `${h.hour}:00`),
    datasets: [
      {
        label: "Ricavi per ora (€)",
        data: stats.revenueByHour.map((h) => h.revenue),
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }
    ]
  };

  // ============================
  //   GRAFICO RICAVI PER GIORNO DELLA SETTIMANA
  // ============================
  const revenueWeekdayData = {
    labels: stats.revenueByWeekday.map((d) => d.weekday.trim()),
    datasets: [
      {
        label: "Ricavi per giorno (€)",
        data: stats.revenueByWeekday.map((d) => d.revenue),
        backgroundColor: "rgba(255, 206, 86, 0.6)"
      }
    ]
  };

  return (
    <Layout>
      <h1 className="text-3xl mb-6">Statistiche Admin</h1>

      {/* ============================
          KPI
      ============================ */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl">Provider Totali</h2>
          <p className="text-3xl font-bold">{stats.totalProviders}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl">Clienti Totali</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl">Prenotazioni Totali</h2>
          <p className="text-3xl font-bold">{stats.totalReservations}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl">Ricavi Totali</h2>
          <p className="text-3xl font-bold">€{stats.totalRevenue}</p>
        </div>
      </div>

      {/* ============================
          GRAFICI
      ============================ */}

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl mb-4">Prenotazioni per giorno</h2>
        <Line data={reservationsData} />
      </div>

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl mb-4">Provider approvati vs in attesa</h2>
        <Bar data={providerData} />
      </div>

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl mb-4">Ricavi giornalieri</h2>
        <Line data={revenueData} />
      </div>

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl mb-4">Ricavi mensili</h2>
        <Bar data={revenueMonthData} />
      </div>

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl mb-4">Ricavi annuali</h2>
        <Bar data={revenueYearData} />
      </div>

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl mb-4">Ricavi per provider</h2>
        <Bar data={revenueProviderData} />
      </div>

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl mb-4">Ricavi per servizio (Top 10)</h2>
        <Bar data={revenueServiceData} />
      </div>

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl mb-4">Ricavi per categoria</h2>
        <Bar data={revenueCategoryData} />
      </div>

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl mb-4">Ricavi per fascia oraria</h2>
        <Bar data={revenueHourData} />
      </div>

      <div className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl mb-4">Ricavi per giorno della settimana</h2>
        <Bar data={revenueWeekdayData} />
      </div>

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl mb-4">Top 5 servizi più prenotati</h2>
        {stats.topServices.map((s) => (
          <div key={s.listing_id} className="border p-3 mb-2">
            Servizio #{s.listing_id} — {s.count} prenotazioni
          </div>
        ))}
      </div>
    </Layout>
  );
}

