import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getStats,
  getReservations,
} from "../../api/admin";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
const [reservations, setReservations] =
  useState([]);
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStats();

        console.log("STATS RESPONSE:", data);

        if (data.success) {
  setStats(data.stats);

  const reservationsData =
    await getReservations();

  setReservations(
    reservationsData.reservations || []
  );
}
      } catch (error) {
        console.error("STATS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);
const bookingData = [
  {
    name: "Prenotazioni",
    valore: stats?.reservations ?? 0,
  },
  {
    name: "Cancellate",
    valore:
      stats?.cancelledReservations ?? 0,
  },
];
  const revenueData =
  stats?.monthlyRevenue ?? [];

console.log("STATS:", stats);
console.log(
  "MONTHLY REVENUE:",
  revenueData
);

console.log(
  "MONTHLY REVENUE:",
  revenueData
);
console.log(
  "RESERVATIONS:",
  reservations
);
if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Caricamento statistiche...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Admin</h1>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "20px",
  }}
>
  <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}>
    <h3>Utenti Totali</h3>
    <p style={{ fontSize: "28px", fontWeight: "bold" }}>
      {stats?.users ?? 0}
    </p>
  </div>

  <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}>
    <h3>Provider Totali</h3>
    <p style={{ fontSize: "28px", fontWeight: "bold" }}>
      {stats?.providers ?? 0}
    </p>
  </div>

  <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}>
    <h3>Servizi Totali</h3>
    <p style={{ fontSize: "28px", fontWeight: "bold" }}>
      {stats?.services ?? 0}
    </p>
  </div>

  <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}>
    <h3>Provider Approvati</h3>
    <p style={{ fontSize: "28px", fontWeight: "bold" }}>
      {stats?.approvedProviders ?? 0}
    </p>
  </div>

  <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}>
    <h3>Prenotazioni Totali</h3>
    <p style={{ fontSize: "28px", fontWeight: "bold" }}>
      {stats?.reservations ?? 0}
    </p>
  </div>

  <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}>
    <h3>Prenotazioni Cancellate</h3>
    <p style={{ fontSize: "28px", fontWeight: "bold" }}>
      {stats?.cancelledReservations ?? 0}
    </p>
  </div>

  <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}>
    <h3>Recensioni Totali</h3>
    <p style={{ fontSize: "28px", fontWeight: "bold" }}>
      {stats?.reviews ?? 0}
    </p>
  </div>

  <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}>
    <h3>Ricavi Globali</h3>
    <p style={{
      fontSize: "28px",
      fontWeight: "bold",
      color: "#16a34a",
    }}>
      € {stats?.revenue ?? 0}
    </p>
  </div>
<div
  style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "30px",
  }}
>
  <h3>📊 Prenotazioni</h3>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <BarChart data={bookingData}>
      <CartesianGrid
        strokeDasharray="3 3"
      />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="valore"
        fill="#2563eb"
      />
    </BarChart>
  </ResponsiveContainer>
</div>
</div>
    <div
  style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "30px",
  }}
>
  <h3>💰 Ricavi Mensili</h3>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <BarChart data={revenueData}>
      <CartesianGrid
        strokeDasharray="3 3"
      />

      <XAxis dataKey="month" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="revenue"
        fill="#16a34a"
      />
    </BarChart>
  </ResponsiveContainer>
</div>
      <div style={{ marginTop: "30px" }}>
        <h2>Gestione</h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <Link
            to="/admin/providers"
            style={{
              padding: "10px 18px",
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "6px",
            }}
          >
            Provider Pending
          </Link>

          <Link
            to="/admin/services"
            style={{
              padding: "10px 18px",
              background: "#16a34a",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "6px",
            }}
          >
            Services Pending
</Link>
</div>
</div>

<div
  style={{
    marginTop: "40px",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  }}
>
  <h2>Prenotazioni Recenti</h2>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "15px",
    }}
  >
    <thead>
      <tr>
        <th>ID</th>
        <th>Cliente</th>
        <th>Servizio</th>
        <th>Stato</th>
        <th>Data</th>
      </tr>
    </thead>

    <tbody>
      {reservations.map((r) => (
        <tr key={r.id}>
          <td>{r.id}</td>
          <td>{r.customer_name}</td>
          <td>{r.service_name}</td>
          <td>
  <span
    style={{
      padding: "4px 10px",
      borderRadius: "999px",
      fontWeight: "bold",
      background:
        r.status === "confirmed"
          ? "#dcfce7"
          : r.status === "pending"
          ? "#fef9c3"
          : "#fee2e2",
      color:
        r.status === "confirmed"
          ? "#166534"
          : r.status === "pending"
          ? "#854d0e"
          : "#991b1b",
    }}
  >
    {r.status}
  </span>
</td>
          <td>
            {new Date(
              r.created_at
            ).toLocaleDateString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>
);
}