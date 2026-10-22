import Layout from "../../components/Layout";

export default function ProviderDashboard() {
  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Benvenuto Provider</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Documenti</h3>
          <p className="text-gray-600">Carica documenti per la verifica</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Servizi</h3>
          <p className="text-gray-600">Crea nuovi servizi</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Slot</h3>
          <p className="text-gray-600">Gestisci disponibilità</p>
        </div>
      </div>
    </Layout>
  );
}

