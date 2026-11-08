import GlobalNavbar from "./GlobalNavbar";
import GlobalSidebar from "./GlobalSidebar";

export default function Layout({
  children,
}) {
  return (
    <div
  className={`flex min-h-screen ${
    document.documentElement.classList.contains(
      "dark"
    )
      ? "bg-slate-900 text-white"
      : "bg-gray-100 text-black"
  } transition-colors duration-300`}
>
      <GlobalSidebar />

      <div className="flex-1">
        <GlobalNavbar />

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}