import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}) {
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
          background: "#f3f4f6",
        }}
      >
        {children}
      </div>
    </div>
  );
}