import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../../api/admin";
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

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStats();

        console.log("STATS RESPONSE:", data);

        if (data.success) {
          setStats(data.stats);
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
    </div>
  );
}