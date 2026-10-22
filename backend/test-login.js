fetch("http://localhost:3001/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email: "admin@example.com",
        password: "admin123"
    })
})
.then(res => res.text())
.then(console.log)
.catch(console.error);

