document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      document.getElementById("result").textContent =
        "Login fallito: " + (data.error || data.message);
      return;
    }

    // Salva il token JWT
    localStorage.setItem("token", data.token);

    // Redirect alla pagina dei documenti del provider
    window.location.href = "index-provider-documents.html";

  } catch (err) {
    document.getElementById("result").textContent = "Errore di rete: " + err.message;
  }
});
