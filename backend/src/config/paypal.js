const PAYPAL_SANDBOX_URL =
  "https://api-m.sandbox.paypal.com";

const PAYPAL_LIVE_URL =
  "https://api-m.paypal.com";

export const PAYPAL_API_BASE_URL =
  process.env.PAYPAL_MODE === "live"
    ? PAYPAL_LIVE_URL
    : PAYPAL_SANDBOX_URL;

function getCredentials() {
  const clientId =
    process.env.PAYPAL_CLIENT_ID;

  const clientSecret =
    process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PAYPAL_CREDENTIALS_MISSING"
    );
  }

  return {
    clientId,
    clientSecret,
  };
}

export async function getPayPalAccessToken() {
  const {
    clientId,
    clientSecret,
  } = getCredentials();

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_API_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "PAYPAL TOKEN ERROR:",
      data
    );

    throw new Error(
      "PAYPAL_AUTH_FAILED"
    );
  }

  return data.access_token;
}