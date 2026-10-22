import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (req, res) => {
  res.json(await registerUser(req.body));
};

export const login = async (req, res) => {
  res.json(await loginUser(req.body));
};
