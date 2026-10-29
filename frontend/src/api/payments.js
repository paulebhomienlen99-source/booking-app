import axios from "axios";

import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/payments`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function createOrder(
  listing_id,
  slot_id
) {
  return API.post("/create-order", {
    listing_id,
    slot_id,
  });
}

export function captureOrder(orderId) {
  return API.post("/capture-order", {
    orderId,
  });
}