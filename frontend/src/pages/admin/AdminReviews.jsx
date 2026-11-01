import { useEffect, useState } from "react";
import {
  getReviews,
  deleteReview,
} from "../../api/admin";
export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
const [search, setSearch] =
  useState("");
  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const data = await getReviews();

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error(error);
    }
  }
async function handleDelete(id) {
  const confirmed = window.confirm(
    "Eliminare questa recensione?"
  );

  if (!confirmed) return;

  try {
    await deleteReview(id);

    await loadReviews();
  } catch (error) {
    console.error(error);
  }
}
 const filteredReviews =
  reviews.filter((review) =>
    review.comment
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )
  ); 
return (
    <div style={{ padding: "20px" }}>
      <h1>⭐ Gestione Recensioni</h1>

<p>
  Totale recensioni:{" "}
  <strong>{reviews.length}</strong>
</p>

<input
  type="text"
  placeholder="Cerca commento..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  style={{
    padding: "10px",
    width: "300px",
    marginTop: "20px",
    marginBottom: "20px",
  }}
/>

      <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  }}
>
  <thead>
    <tr>
      <th>ID</th>
      <th>Cliente</th>
      <th>Provider</th>
      <th>Rating</th>
      <th>Commento</th>
      <th>Data</th>
      <th>Azioni</th>
    </tr>
  </thead>

  <tbody>
    {filteredReviews.map((review) => (
      <tr key={review.id}>
        <td>{review.id}</td>

        <td>{review.customer_id}</td>

        <td>{review.provider_id}</td>

        <td>
          ⭐ {review.rating}
        </td>

        <td>{review.comment}</td>

        <td>
          {new Date(
            review.created_at
          ).toLocaleDateString()}
        </td>

        <td>
          <button
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 10px",
              cursor: "pointer",
            }}
            onClick={() =>
              handleDelete(review.id)
            }
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}
