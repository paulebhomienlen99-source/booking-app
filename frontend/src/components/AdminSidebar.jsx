export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <nav className="flex flex-col gap-4">
        <a href="/admin" className="hover:text-blue-400">Dashboard</a>
        <a href="/admin/providers" className="hover:text-blue-400">Provider Pending</a>
        <a href="/admin/services" className="hover:text-blue-400">Services Pending</a>
      </nav>
    </div>
  );
}
