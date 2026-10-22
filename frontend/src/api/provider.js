import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/provider`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function uploadDocument(file) {
  const formData = new FormData();

  formData.append("document", file);

  return API.post(
    "/upload-document",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
}

export function createListing(
  title,
  description,
  price
) {
  return API.post(
    "/create-listing",
    {
      title,
      description,
      price,
    }
  );
}

export function createSlot(
  service_id,
  date,
  start_time,
  end_time
) {
  return API.post(
    "/create-slot",
    {
      service_id,
      date,
      start_time,
      end_time,
    }
  );
}

export function getMyServices() {
  return API.get("/services");
}

export function getProviderBookings() {
  return API.get("/bookings");
}

/*
=====================================
PROVIDER PROFILE
=====================================
*/

export function createProviderProfile(
  name,
  phone
) {
  return API.post("/create", {
    name,
    phone,
  });
}
