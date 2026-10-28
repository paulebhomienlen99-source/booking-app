import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/*
=====================================
ADMIN STATS
=====================================
*/

export async function getStats() {
  const response = await API.get("/stats");
  return response.data;
}

/*
=====================================
PENDING PROVIDERS
=====================================
*/

export async function getPendingProviders() {
  const response = await API.get(
    "/providers/pending"
  );

  return response.data;
}

export async function approveProvider(id) {
  const response = await API.put(
    `/providers/${id}/approve`
  );

  return response.data;
}

export async function rejectProvider(id) {
  const response = await API.put(
    `/providers/${id}/reject`
  );

  return response.data;
}

/*
=====================================
PENDING SERVICES
=====================================
*/

export async function getPendingServices() {
  const response = await API.get(
    "/services/pending"
  );

  return response.data;
}

export async function approveService(id) {
  const response = await API.put(
    `/services/${id}/approve`
  );

  return response.data;
}

export async function rejectService(id) {
  const response = await API.put(
    `/services/${id}/reject`
  );

  return response.data;
}

/*
=====================================
ADMIN RESERVATIONS
=====================================
*/

export async function getReservations() {
  const response =
    await API.get("/reservations");

  return response.data;
}

