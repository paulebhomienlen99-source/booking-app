import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/customers`,
});

export function getAllServices() {
  return API.get("/services");
}

export function getMyBookings() {
  const token =
    localStorage.getItem("token");

  return axios.get(
    `${API_BASE_URL}/reservations/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function getServiceSlots(serviceId) {
  return axios.get(
    `${API_BASE_URL}/slots/service/${serviceId}`
  );
}

export function reserveSlot(
  customer_id,
  listing_id,
  slot_id
) {
  return axios.post(
    `${API_BASE_URL}/reservations/create`,
    {
      customer_id,
      listing_id,
      slot_id,
      payment_status: "completed",
    }
  );
}

export function cancelBooking(id) {
  const token =
    localStorage.getItem("token");

  return axios.post(
    `${API_BASE_URL}/reservations/cancel/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}