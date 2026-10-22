const providerConfig = {
  enabled: Boolean(process.env.BOOKING_PROVIDER_BASE_URL && process.env.BOOKING_PROVIDER_API_KEY),
  baseUrl: process.env.BOOKING_PROVIDER_BASE_URL,
  apiKey: process.env.BOOKING_PROVIDER_API_KEY
};

function providerHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${providerConfig.apiKey}`
  };
}

async function searchHotels({ destination, checkin, checkout, guests = 1 }) {
  if (!providerConfig.enabled) {
    return { enabled: false, results: [], message: 'Hotel provider credentials are not configured' };
  }

  const url = new URL('/hotels/search', providerConfig.baseUrl);
  url.searchParams.set('destination', destination);
  url.searchParams.set('checkin', checkin);
  url.searchParams.set('checkout', checkout);
  url.searchParams.set('guests', String(guests));

  const response = await fetch(url, { headers: providerHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Provider search failed with ${response.status}`);
  return { enabled: true, results: data.results || data.data || data };
}

async function createHotelReservation(payload) {
  if (!providerConfig.enabled) {
    return { enabled: false, confirmed: false, message: 'Hotel provider credentials are not configured' };
  }

  const response = await fetch(new URL('/reservations', providerConfig.baseUrl), {
    method: 'POST',
    headers: providerHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Provider reservation failed with ${response.status}`);
  return { enabled: true, confirmed: true, confirmation: data.confirmation || data.confirmation_number || data };
}

module.exports = { providerConfig, searchHotels, createHotelReservation };
