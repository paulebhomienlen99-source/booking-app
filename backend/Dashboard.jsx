import Layout from "../components/Layout";

export default function Dashboard() {
  const provider = JSON.parse(localStorage.getItem("provider"));

  return (
    <Layout>
      <h1 className="text-2xl">Benvenuto, {provider.email}</h1>
      <p className="mt-2">Gestisci documenti, servizi, disponibilità e prenotazioni.</p>
    </Layout>
  );
}
