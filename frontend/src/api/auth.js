import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
});

export function login(email, password) {
  return API.post("/login", {
    email,
    password,
  });
}

export function register(
  name,
  email,
  password,
  role
) {
  return API.post("/register", {
    name,
    email,
    password,
    role,
  });
}
