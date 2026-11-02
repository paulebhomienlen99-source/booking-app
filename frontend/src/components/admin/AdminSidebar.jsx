import { Link } from "react-router-dom";

export default function AdminSidebar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/admin/login";
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    padding: "12px",
    borderRadius: "8px",
    background: "#1f2937",
    fontWeight: "500",
  };

  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#111827",
        color: "#fff",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        BookHub Admin
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Link
          to="/admin"
          style={linkStyle}
        >
          📊 Dashboard
        </Link>

        <Link
          to="/admin/users"
          style={linkStyle}
        >
          👤 Users
        </Link>

        <Link
          to="/admin/reservations"
          style={linkStyle}
        >
          📅 Reservations
        </Link>

        <Link
          to="/admin/reviews"
          style={linkStyle}
        >
          ⭐ Reviews
        </Link>

        <Link
          to="/admin/providers"
          style={linkStyle}
        >
          🏢 Providers
        </Link>

        <Link
          to="/admin/services"
          style={linkStyle}
        >
          🛠 Services
        </Link>

        <button
          onClick={logout}
          style={{
            marginTop: "20px",
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}