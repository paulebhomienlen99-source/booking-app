import AdminLayout from "../../components/admin/AdminLayout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
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
const bookingTrendData =
  stats?.bookingTrend ?? [];
const revenueTrendData =
  stats?.revenueTrend ?? [];
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
function exportAnalyticsPDF() {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("BookHub Analytics Report", 20, 20);

  doc.setFontSize(12);

  doc.text(
    `Users: ${stats?.users ?? 0}`,
    20,
    40
  );

  doc.text(
    `Providers: ${stats?.providers ?? 0}`,
    20,
    50
  );

  doc.text(
    `Services: ${stats?.services ?? 0}`,
    20,
    60
  );

  doc.text(
    `Reservations: ${stats?.reservations ?? 0}`,
    20,
    70
  );

  doc.text(
    `Reviews: ${stats?.reviews ?? 0}`,
    20,
    80
  );

  doc.text(
    `Revenue: €${stats?.revenue ?? 0}`,
    20,
    90
  );

  doc.text(
    `New Users (30 days): ${stats?.newUsers ?? 0}`,
    20,
    110
  );

  doc.text(
    `New Providers (30 days): ${stats?.newProviders ?? 0}`,
    20,
    120
  );

  doc.text(
    `New Reviews (30 days): ${stats?.newReviews ?? 0}`,
    20,
    130
  );

  doc.save(
    "BookHub-Analytics-Report.pdf"
  );
}
  function exportAnalyticsCSV() {
  const rows = [
    ["Metric", "Value"],
    ["Users", stats?.users ?? 0],
    ["Providers", stats?.providers ?? 0],
    ["Services", stats?.services ?? 0],
    ["Reservations", stats?.reservations ?? 0],
    ["Cancelled Reservations", stats?.cancelledReservations ?? 0],
    ["Reviews", stats?.reviews ?? 0],
    ["Revenue", stats?.revenue ?? 0],
  ];

  const csv = rows
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "analytics-export.csv";

  link.click();
}
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Admin</h1>
<AdminSidebar />
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  }}
>
  <button
    onClick={exportAnalyticsCSV}
    style={{
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    ⬇️ Export Analytics CSV
  </button>

  <button
    onClick={exportAnalyticsPDF}
    style={{
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    📄 Export PDF Report
  </button>
</div>
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
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}
>
  <h3>👤 Nuovi Utenti (30 giorni)</h3>

  <p
    style={{
      fontSize: "28px",
      fontWeight: "bold",
      color: "#2563eb",
    }}
  >
    +{stats?.newUsers ?? 0}
  </p>
</div>

<div
  style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}
>
  <h3>🏢 Nuovi Provider (30 giorni)</h3>

  <p
    style={{
      fontSize: "28px",
      fontWeight: "bold",
      color: "#16a34a",
    }}
  >
    +{stats?.newProviders ?? 0}
  </p>
</div>

<div
  style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
  }}
>
  <h3>⭐ Nuove Recensioni (30 giorni)</h3>

  <p
    style={{
      fontSize: "28px",
      fontWeight: "bold",
      color: "#f59e0b",
    }}
  >
    +{stats?.newReviews ?? 0}
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
  <div
  style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "30px",
  }}
>
  <h3>📈 Booking Trend (Ultimi 30 Giorni)</h3>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <BarChart data={bookingTrendData}>
      <CartesianGrid
        strokeDasharray="3 3"
      />

      <XAxis dataKey="day" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="bookings"
        fill="#f59e0b"
      />
    </BarChart>
  </ResponsiveContainer>
</div>    
     <div
  style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "30px",
  }}
>
  <h3>💰 Revenue Trend (Ultimi 30 Giorni)</h3>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <BarChart data={revenueTrendData}>
      <CartesianGrid
        strokeDasharray="3 3"
      />

      <XAxis dataKey="day" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="revenue"
        fill="#10b981"
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
<Link
  to="/admin/reviews"
  style={{
    padding: "10px 18px",
    background: "#f59e0b",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
  }}
>
  Reviews
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
  
  <h2>🏆 Top Providers</h2>

<table
  style={{
    width: "100%",
    marginTop: "15px",
    borderCollapse: "collapse",
  }}
>
  <thead>
    <tr>
      <th>Provider</th>
      <th>Prenotazioni</th>
    </tr>
  </thead>

  <tbody>
    {stats?.topProviders?.map(
      (provider, index) => (
        <tr key={index}>
          <td>{provider.name}</td>
          <td>{provider.bookings}</td>
        </tr>
      )
    )}
  </tbody>
</table>
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
  <h2>👥 Top Customers</h2>

  <table
    style={{
      width: "100%",
      marginTop: "15px",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr>
        <th>Cliente</th>
        <th>Prenotazioni</th>
      </tr>
    </thead>

    <tbody>
      {stats?.topCustomers?.map(
        (customer, index) => (
          <tr key={index}>
            <td>{customer.email}</td>
            <td>{customer.bookings}</td>
          </tr>
        )
      )}
    </tbody>
  </table>
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
  <h2>⭐ Most Booked Services</h2>

  <table
    style={{
      width: "100%",
      marginTop: "15px",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr>
        <th>Servizio</th>
        <th>Prenotazioni</th>
      </tr>
    </thead>

    <tbody>
      {stats?.topServices?.map(
        (service, index) => (
          <tr key={index}>
            <td>{service.title}</td>
            <td>{service.bookings}</td>
          </tr>
        )
      )}
    </tbody>
  </table>
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
  <h2>💰 Revenue Per Provider</h2>

  <table
    style={{
      width: "100%",
      marginTop: "15px",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr>
        <th>Provider</th>
        <th>Revenue</th>
      </tr>
    </thead>

    <tbody>
      {stats?.revenuePerProvider?.map(
        (provider, index) => (
          <tr key={index}>
            <td>{provider.name}</td>
            <td>€ {provider.revenue}</td>
          </tr>
        )
      )}
    </tbody>
  </table>
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
  <h2>⭐ Top Rated Providers</h2>

  <table
    style={{
      width: "100%",
      marginTop: "15px",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr>
        <th>Provider</th>
        <th>Rating</th>
      </tr>
    </thead>

    <tbody>
      {stats?.topRatedProviders?.map(
        (provider, index) => (
          <tr key={index}>
            <td>{provider.name}</td>
            <td>
              ⭐ {provider.rating}
            </td>
          </tr>
        )
      )}
    </tbody>
  </table>
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