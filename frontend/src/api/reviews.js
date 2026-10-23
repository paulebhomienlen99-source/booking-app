import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/reviews",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export function createReview({
  reservation_id,
  provider_id,
  rating,
  comment,
}) {
  return API.post("/", {
    reservation_id,
    provider_id,
    rating,
    comment,
  });
}

export function getProviderReviews(
  providerId
) {
  return API.get(
    `/provider/${providerId}`
  );
}

export function getProviderRating(
  providerId
) {
  return API.get(
    `/provider/${providerId}/rating`
  );
}
export function getReviewByReservation(
  reservationId
) {
  return API.get(
    `/reservation/${reservationId}`
  );
}