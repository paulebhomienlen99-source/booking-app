import {
  createProviderService,
  uploadDocumentService,
  approveProviderService
} from '../services/provider.service.js';

export const createProvider = async (req, res) => {
  res.json(await createProviderService(req.body));
};

export const uploadDocument = async (req, res) => {
  res.json(await uploadDocumentService(req.body));
};

export const approveProvider = async (req, res) => {
  res.json(await approveProviderService(req.params.id));
};
