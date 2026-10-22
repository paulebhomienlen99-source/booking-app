import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full">{children}</div>
    </div>
  );
}
