export default function ProviderSidebar() {
  return (
    <div className="w-64 bg-blue-900 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Provider Panel</h2>

      <nav className="flex flex-col gap-4">
        <a href="/provider" className="hover:text-blue-300">Dashboard</a>
        <a href="/provider/upload-document" className="hover:text-blue-300">Upload Document</a>
        <a href="/provider/create-listing" className="hover:text-blue-300">Create Listing</a>
        <a href="/provider/create-slot" className="hover:text-blue-300">Create Slot</a>
      </nav>
    </div>
  );
}
