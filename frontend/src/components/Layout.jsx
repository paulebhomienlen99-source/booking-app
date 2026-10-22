import GlobalNavbar from "./GlobalNavbar";
import GlobalSidebar from "./GlobalSidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <GlobalSidebar />

      <div className="flex-1">
        <GlobalNavbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
