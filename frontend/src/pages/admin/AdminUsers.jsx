import { useEffect, useState } from "react";
import {
  getUsers,
  getUserDetails,
  changeUserRole,
  suspendUser,
  reactivateUser,
  deleteUser,
} from "../../api/admin";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("all");
  const [selectedUser, setSelectedUser] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);
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

  async function handleRoleChange(
    userId,
    newRole
  ) {
    try {
      await changeUserRole(
        userId,
        newRole
      );

      await loadUsers();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSuspend(id) {
    try {
      await suspendUser(id);
      await loadUsers();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleReactivate(id) {
    try {
      await reactivateUser(id);
      await loadUsers();
    } catch (error) {
      console.error(error);
    }
  }
async function handleView(id) {
  try {
    const data =
      await getUserDetails(id);

    if (data.success) {
      setSelectedUser(data.user);
      setShowDetails(true);
    }
  } catch (error) {
    console.error(error);
  }
}
  async function handleDelete(id) {
  const confirmed = window.confirm(
    "Sei sicuro di voler eliminare questo utente?"
  );

  if (!confirmed) return;

  try {
    await deleteUser(id);

    await loadUsers();

    if (
      selectedUser &&
      selectedUser.id === id
    ) {
      setSelectedUser(null);
      setShowDetails(false);
    }
  } catch (error) {
    console.error(error);

    alert(
  error?.response?.data?.error ||
  "Impossibile eliminare questo utente"
);
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
      "Status",
    ];

    const rows = filteredUsers.map(
      (u) => [
        u.id,
        u.email,
        u.role,
        u.is_active
          ? "Active"
          : "Suspended",
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map(
            (u) => (
              <tr key={u.id}>
                <td>{u.id}</td>

                <td>{u.email}</td>

                <td>{u.role}</td>

                <td>
                  {u.is_active
                    ? "✅ Active"
                    : "⛔ Suspended"}
                </td>

                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(
                          u.id,
                          e.target.value
                        )
                      }
                    >
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

                                        {u.is_active ? (
                      <button
                        onClick={() =>
                          handleSuspend(u.id)
                        }
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleReactivate(u.id)
                        }
                      >
                        Reactivate
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleView(u.id)
                      }
                    >
                      View
                    </button>

                    <button
  style={{
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  }}
  onClick={() =>
    handleDelete(u.id)
  }
>
  Delete
</button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {showDetails &&
        selectedUser && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                minWidth: "400px",
              }}
            >
              <h2>User Details</h2>

              <p>
                <strong>ID:</strong>{" "}
                {selectedUser.id}
              </p>

              <p>
                <strong>Name:</strong>{" "}
                {selectedUser.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedUser.email}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {selectedUser.role}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedUser.is_active
                  ? "✅ Active"
                  : "⛔ Suspended"}
              </p>

              <button
                onClick={() =>
                  setShowDetails(false)
                }
              >
                Close
              </button>
            </div>
          </div>
        )}
    </div>
  );
}