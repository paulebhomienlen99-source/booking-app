export default function GlobalSidebar() {
  const role =
    localStorage.getItem("role") || "admin";

  const links = {
    admin: [
      {
        label: "Dashboard",
        url: "/admin",
      },
      {
        label: "Provider Pending",
        url: "/admin/providers",
      },
      {
        label: "Services Pending",
        url: "/admin/services",
      },
    ],

    provider: [
      {
        label: "Dashboard",
        url: "/provider",
      },
      {
        label: "Completa Profilo",
        url: "/provider/setup",
      },
      {
        label: "Upload Document",
        url: "/provider/upload-document",
      },
      {
        label: "Create Listing",
        url: "/provider/create-listing",
      },
      {
        label: "Create Slot",
        url: "/provider/create-slot",
      },
      {
        label: "Prenotazioni Ricevute",
        url: "/provider/bookings",
      },
    ],

    customer: [
      {
        label: "Dashboard",
        url: "/customer",
      },
      {
        label: "Services",
        url: "/customer/services",
      },
      {
        label: "My Bookings",
        url: "/customer/bookings",
      },
    ],
  };

  const color = {
    admin: "bg-gray-900",
    provider: "bg-blue-900",
    customer: "bg-green-900",
  };

  const menu = links[role] || [];

  return (
    <div
      className={`w-64 ${
        color[role] || "bg-gray-900"
      } text-white h-screen p-4`}
    >
      <h2 className="text-xl font-bold mb-6 capitalize">
        {role} Panel
      </h2>

      <nav className="flex flex-col gap-4">
        {menu.map((item) => (
          <a
            key={item.url}
            href={item.url}
            className="hover:text-gray-300"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}