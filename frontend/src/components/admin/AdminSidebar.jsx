import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/admin/login";
  };

  const linkStyle = ({ isActive }) => ({
    color: "#fff",
    textDecoration: "none",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: isActive
      ? "#2563eb"
      : "#1f2937",
    fontWeight: "500",
    transition: "all 0.2s ease",
  });

  const sectionTitleStyle = {
    color: "#9ca3af",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginTop: "15px",
    marginBottom: "5px",
    fontWeight: "bold",
  };

  return (
    <div
      style={{
  width: "220px",
  flexShrink: 0,
  minHeight: "100vh",
  background: "#111827",
  color: "#fff",
  padding: "20px",
  boxSizing: "border-box",
  borderRight: "1px solid #1f2937",
}}
    >
      <h2
        style={{
          marginBottom: "30px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        🚀 BookHub Admin
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={sectionTitleStyle}>
          Analytics
        </div>

        <NavLink
          to="/admin"
          end
          style={linkStyle}
        >
          📊 Dashboard
        </NavLink>

        <div style={sectionTitleStyle}>
          Management
        </div>

        <NavLink
          to="/admin/users"
          style={linkStyle}
        >
          👤 Users
        </NavLink>

        <NavLink
          to="/admin/reservations"
          style={linkStyle}
        >
          📅 Reservations
        </NavLink>

        <NavLink
          to="/admin/reviews"
          style={linkStyle}
        >
          ⭐ Reviews
        </NavLink>

        <NavLink
          to="/admin/providers"
          style={linkStyle}
        >
          🏢 Providers
        </NavLink>

        <NavLink
          to="/admin/services"
          style={linkStyle}
        >
          🛠 Services
        </NavLink>

        <button
          onClick={logout}
          style={{
            marginTop: "25px",
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