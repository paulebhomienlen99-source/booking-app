export default function CustomerSidebar() {
  return (
    <div className="w-64 bg-green-900 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Customer Panel</h2>

      <nav className="flex flex-col gap-4">
        <a href="/customer" className="hover:text-green-300">Dashboard</a>
        <a href="/customer/services" className="hover:text-green-300">Services</a>
        <a href="/customer/bookings" className="hover:text-green-300">My Bookings</a>
      </nav>
    </div>
  );
}
