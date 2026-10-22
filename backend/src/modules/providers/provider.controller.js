import {
  createProvider,
  getProviderByUserId,
  getProviders,
  updateProviderStatus
} from './provider.service.js';

export async function createProviderHandler(req, res) {
  try {
    const provider = await createProvider(req.user.id, req.body);
    res.status(201).json(provider);
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
}

export async function getMyProviderHandler(req, res) {
  const provider = await getProviderByUserId(req.user.id);
  res.json(provider);
}

export async function getProvidersHandler(req, res) {
  const providers = await getProviders();
  res.json(providers);
}

export async function updateProviderStatusHandler(req, res) {
  const provider = await updateProviderStatus(req.params.id, req.body.status);
  res.json(provider);
}
