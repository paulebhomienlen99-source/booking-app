import {
  insertProvider,
  findProviderByUserId,
  findAllProviders,
  setProviderStatus
} from './provider.repository.js';

export async function createProvider(userId, data) {
  return insertProvider(userId, data);
}

export async function getProviderByUserId(userId) {
  return findProviderByUserId(userId);
}

export async function getProviders() {
  return findAllProviders();
}

export async function updateProviderStatus(id, status) {
  return setProviderStatus(id, status);
}
