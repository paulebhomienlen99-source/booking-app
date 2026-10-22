import { createSlotService } from '../services/slot.service.js';

export const createSlot = async (req, res) => {
  res.json(await createSlotService(req.body));
};
