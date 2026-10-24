import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/customers",
});

export function getAllServices() {
  return API.get("/services");
}

export function getMyBookings() {
  const token =
    localStorage.getItem("token");

  return axios.get(
    "http://localhost:5000/api/reservations/my",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function getServiceSlots(serviceId) {
  return axios.get(
    `http://localhost:5000/api/slots/service/${serviceId}`
  );
}

export function reserveSlot(
  customer_id,
  listing_id,
  slot_id
) {
  return axios.post(
    "http://localhost:5000/api/reservations/create",
    {
      customer_id,
      listing_id,
      slot_id,
      payment_status: "completed",
    }
  );
}