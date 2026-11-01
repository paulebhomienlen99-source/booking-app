import { useEffect, useState } from "react";
import { getUsers } from "../../api/admin";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const filteredUsers = users.filter(
    (u) => {
      const matchesSearch =
        u.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all"
          ? true
          : u.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    }
  );

  function exportCSV() {
    const headers = [
      "ID",
      "Email",
      "Role",
    ];

    const rows = filteredUsers.map(
      (u) => [
        u.id,
        u.email,
        u.role,
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

    const today = new Date()
      .toISOString()
      .split("T")[0];

    link.download =
      `bookhub-users-${today}.csv`;

    link.click();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        👥 Gestione Utenti
      </h1>

      <button
        onClick={exportCSV}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          marginTop: "10px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        ⬇️ Export CSV
      </button>

      <p>
        Totale utenti:{" "}
        <strong>
          {filteredUsers.length}
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
          placeholder="Cerca email..."
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
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(
              e.target.value
            )
          }
          style={{
            padding: "10px",
          }}
        >
          <option value="all">
            Tutti
          </option>

          <option value="customer">
            Customer
          </option>

          <option value="provider">
            Provider
          </option>

          <option value="admin">
            Admin
          </option>
        </select>
      </div>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse:
            "collapse",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map(
            (u) => (
              <tr key={u.id}>
                <td>{u.id}</td>

                <td>{u.email}</td>

                <td>{u.role}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}