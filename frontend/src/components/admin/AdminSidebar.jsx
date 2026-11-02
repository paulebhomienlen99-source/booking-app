import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "#111827",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h2>BookHub Admin</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <Link to="/admin">📊 Dashboard</Link>
        <Link to="/admin/users">👤 Users</Link>
        <Link to="/admin/reservations">📅 Reservations</Link>
        <Link to="/admin/reviews">⭐ Reviews</Link>
        <Link to="/admin/providers">🏢 Providers</Link>
        <Link to="/admin/services">🛠 Services</Link>
      </div>
    </div>
  );
}