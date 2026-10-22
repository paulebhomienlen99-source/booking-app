import { createListingService } from '../services/listing.service.js';

export const createListing = async (req, res) => {
  res.json(await createListingService(req.body));
};
