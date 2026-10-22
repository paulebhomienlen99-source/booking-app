export default function GlobalNavbar() {
  const role = localStorage.getItem("role");

  return (
    <div className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold capitalize">{role} Dashboard</h1>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
