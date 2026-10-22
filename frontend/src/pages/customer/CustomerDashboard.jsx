import Layout from "../../components/Layout";

export default function CustomerDashboard() {
  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Benvenuto Cliente</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Servizi</h3>
          <p className="text-gray-600">Esplora i servizi disponibili</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Prenotazioni</h3>
          <p className="text-gray-600">Gestisci le tue prenotazioni</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold">Profilo</h3>
          <p className="text-gray-600">Aggiorna le tue informazioni</p>
        </div>
      </div>
    </Layout>
  );
}

