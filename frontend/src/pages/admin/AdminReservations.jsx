import { useEffect, useState } from "react";
import { getReservations } from "../../api/admin";

export default function AdminReservations() {
  const [reservations, setReservations] =
    useState([]);

  useEffect(() => {
    const load = async () => {
      const data =
        await getReservations();

      if (data.success) {
        setReservations(
          data.reservations
        );
      }
    };

    load();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestione Prenotazioni</h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          marginTop: "20px"
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Servizio</th>
            <th>Stato</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.customer_name}</td>
              <td>{r.service_name}</td>
              <td>{r.status}</td>
              <td>
                {new Date(
                  r.created_at
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}