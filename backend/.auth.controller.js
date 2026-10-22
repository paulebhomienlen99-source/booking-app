import { registerUser, loginUser } from '../services/auth.service.js';

export const register = async (req, res) => {
  const result = await registerUser(req.body);
  res.json(result);
};

export const login = async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
};
