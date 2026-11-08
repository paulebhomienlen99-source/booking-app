import AdminSidebar from "./AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

export default function AdminLayout({
  children,
}) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <AdminSidebar />

      <div
        style={{
          flex: 1,
          padding: "20px",
          minHeight: "100vh",
          background:
            theme === "dark"
              ? "#0f172a"
              : "#f3f4f6",
          color:
            theme === "dark"
              ? "#ffffff"
              : "#111827",
          transition:
            "all 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}