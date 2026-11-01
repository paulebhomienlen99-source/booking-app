import { useEffect, useState } from "react";
import { getReservations } from "../../api/admin";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      const data = await getReservations();

      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const filteredReservations = reservations.filter(
    (r) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : r.status === statusFilter;

      const matchesSearch =
        r.customer_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        r.service_name
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    }
  );

  function exportCSV() {
    const headers = [
  "ID",
  "Cliente",
  "Provider",
  "Servizio",
  "Prezzo",
  "Stato",
  "Payment Status",
  "Data",
];

const rows = filteredReservations.map(
  (r) => [
    r.id,
    r.customer_name,
    r.provider_name,
    r.service_name,
    r.price,
    r.status,
    r.payment_status,
    new Date(
      r.created_at
    ).toLocaleString("it-IT"),
  ]
);

    const csvContent = [
  headers.join(";"),
  ...rows.map((row) =>
    row.join(";")
  ),
].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download =
      `reservations-${Date.now()}.csv`;

    link.click();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>📋 Gestione Prenotazioni</h1>

      <button
        onClick={exportCSV}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        ⬇️ Export CSV
      </button>

      <p>
        Totale prenotazioni:{" "}
        <strong>
          {filteredReservations.length}
        </strong>
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Cerca cliente o servizio..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: "10px",
            width: "300px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={{
            padding: "10px",
          }}
        >
          <option value="all">
            Tutte
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>
      </div>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
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
          {filteredReservations.map(
            (r) => (
              <tr key={r.id}>
                <td>{r.id}</td>

                <td>
                  {r.customer_name}
                </td>

                <td>
                  {r.service_name}
                </td>

                <td>
                  <span
                    style={{
                      padding:
                        "4px 10px",
                      borderRadius:
                        "20px",
                      color: "white",
                      backgroundColor:
                        r.status ===
                        "confirmed"
                          ? "green"
                          : "red",
                    }}
                  >
                    {r.status}
                  </span>
                </td>

                <td>
                  {new Date(
                    r.created_at
                  ).toLocaleString(
                    "it-IT"
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

