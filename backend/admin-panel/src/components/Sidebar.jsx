export default function Sidebar() {
  const role = localStorage.getItem("role");

  const links = {
    admin: [
      { label: "Dashboard", url: "/admin" },
      { label: "Provider Pending", url: "/admin/providers" },
      { label: "Services Pending", url: "/admin/services" },
      { label: "Analytics Pro", url: "/analytics" }   // ⭐ AGGIUNTO
    ],
    provider: [
      { label: "Dashboard", url: "/provider" },
      { label: "Upload Document", url: "/provider/upload-document" },
      { label: "Create Listing", url: "/provider/create-listing" },
      { label: "Create Slot", url: "/provider/create-slot" }
    ],
    customer: [
      { label: "Dashboard", url: "/customer" },
      { label: "Services", url: "/customer/services" },
      { label: "My Bookings", url: "/customer/bookings" }
    ]
  };

  const color = {
    admin: "bg-gray-900",
    provider: "bg-blue-900",
    customer: "bg-green-900"
  };

  return (
    <div className={`w-64 ${color[role]} text-white h-screen p-4`}>
      <h2 className="text-xl font-bold mb-6 capitalize">{role} Panel</h2>

      <nav className="flex flex-col gap-4">
        {links[role].map((item) => (
          <a key={item.url} href={item.url} className="hover:text-gray-300">
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

