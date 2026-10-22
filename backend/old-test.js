const axios = require("axios");

async function runTests() {
  try {
    console.log("🔍 TEST LOGIN ADMIN");

    const loginAdmin = await axios.post("http://localhost:3001/admin/login", {
      email: "admin@admin.com",
      password: "admin"
    });

    console.log(loginAdmin.data);

    const adminToken = loginAdmin.data.token;

    // ============================
    console.log("🔍 TEST LISTA PROVIDER (pending)");

    const providers = await axios.get(
      "http://localhost:3001/admin/providers/pending",
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );

    console.log(providers.data);

    // ============================
    console.log("🔍 LOGIN PROVIDER");

    const loginProvider = await axios.post("http://localhost:3001/auth/login", {
      email: "provider@test.com",
      password: "provider"   // ✔ PASSWORD CORRETTA
    });

    console.log(loginProvider.data);

    const providerToken = loginProvider.data.token;

    // ============================
    console.log("🔍 TEST CREAZIONE SERVIZIO (provider)");

    const newListing = await axios.post(
      "http://localhost:3001/provider/create-listing",
      {
        title: "Taglio capelli",
        price: 20
      },
      {
        headers: { Authorization: `Bearer ${providerToken}` }
      }
    );

    console.log(newListing.data);

    const listingId = newListing.data.listing.id;

    // ============================
    console.log("🔍 TEST LISTA SERVIZI APPROVATI (admin)");

    const listings = await axios.get(
      "http://localhost:3001/admin/listings",
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );

    console.log(listings.data);

    // ============================
    console.log("🔍 TEST CREAZIONE PRENOTAZIONE");

    const booking = await axios.post(
      "http://localhost:3001/booking/create",
      {
        listing_id: listingId,
        date: new Date().toISOString()
      },
      {
        headers: { Authorization: `Bearer ${providerToken}` }
      }
    );

    console.log(booking.data);

    console.log("🎉 TUTTI I TEST COMPLETATI CON SUCCESSO");
  } catch (err) {
    console.error("❌ ERRORE:", err.response?.data || err.message);
  }
}

runTests();






