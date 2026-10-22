# ============================
#  SETUP-CODE.PS1 COMPLETO
# ============================

# BACKEND: server.js
Set-Content C:\booking-app\backend\server.js @'
const express = require("express");
const http = require("http");
const os = require("os");
const WebSocket = require("ws");
const db = require("./db");

const app = express();
const server = http.createServer(app);
const wssMonitor = new WebSocket.Server({ server, path: "/monitor" });
const wssProcesses = new WebSocket.Server({ server, path: "/processes" });

app.use(express.json());

let requestCount = 0;
app.use((req, res, next) => {
    requestCount++;
    next();
});

// WEBSOCKET MONITOR
wssMonitor.on("connection", (ws) => {
    const interval = setInterval(() => {
        const cpuLoad = os.loadavg()[0] * 25;
        const ramLoad = (os.totalmem() - os.freemem()) / os.totalmem() * 100;

        ws.send(JSON.stringify({
            cpu: Math.round(cpuLoad),
            ram: Math.round(ramLoad),
            uptime: Math.round(process.uptime()),
            rps: requestCount
        }));
    }, 1000);

    ws.on("close", () => clearInterval(interval));
});

// WEBSOCKET PROCESSI
wssProcesses.on("connection", (ws) => {
    const interval = setInterval(() => {
        const processes = [
            {
                name: "Main API Server",
                pid: process.pid,
                cpu: Math.round(os.loadavg()[0] * 25),
                ram: Math.round(process.memoryUsage().rss / 1024 / 1024)
            }
        ];
        ws.send(JSON.stringify(processes));
    }, 2000);

    ws.on("close", () => clearInterval(interval));
});

// LOGIN + LOG SICUREZZA
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);

    if (!user.rows.length) {
        await db.query(
            "INSERT INTO security_logs(type, ip, details) VALUES($1,$2,$3)",
            ["LOGIN_FAILED", req.ip, "Email non trovata"]
        );
        return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.rows[0].password !== password) {
        await db.query(
            "INSERT INTO security_logs(type, ip, username, details) VALUES($1,$2,$3,$4)",
            ["LOGIN_FAILED", req.ip, email, "Password errata"]
        );
        return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ success: true });
});

// API LOG SICUREZZA
app.get("/admin/security-logs", async (req, res) => {
    const logs = await db.query("SELECT * FROM security_logs ORDER BY date DESC LIMIT 100");
    res.json({ logs: logs.rows });
});

// ALLARMI CPU/RAM
setInterval(() => {
    const cpu = os.loadavg()[0] * 25;
    const ram = (os.totalmem() - os.freemem()) / os.totalmem() * 100;

    if (cpu > 90) console.log("⚠️ ALLARME CPU > 90%");
    if (ram > 80) console.log("⚠️ ALLARME RAM > 80%");
}, 2000);

server.listen(3001, () => {
    console.log("Backend monitor attivo su http/ws://localhost:3001");
});
'@

# BACKEND: db.js
Set-Content C:\booking-app\backend\db.js @'
const { Pool } = require("pg");

const db = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "password",
    database: "booking_app"
});

module.exports = db;
'@

# FRONTEND: mega-dashboard.html
Set-Content C:\booking-app\frontend\admin\mega-dashboard.html @'
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Mega Dashboard Server</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

<h1>Mega Dashboard Server (Real-Time)</h1>

<div class="dashboard-grid">

    <div class="provider-card">
        <h3>CPU</h3>
        <canvas id="cpuChart"></canvas>
        <p id="cpuAlarm"></p>
    </div>

    <div class="provider-card">
        <h3>RAM</h3>
        <canvas id="ramChart"></canvas>
        <p id="ramAlarm"></p>
    </div>

    <div class="provider-card">
        <h3>Richieste al secondo</h3>
        <canvas id="rpsChart"></canvas>
    </div>

    <div class="provider-card">
        <h3>Uptime</h3>
        <canvas id="uptimeGauge"></canvas>
    </div>

    <div class="provider-card">
        <h3>Processi Node.js</h3>
        <div id="process-list"></div>
    </div>

    <div class="provider-card">
        <h3>Log Sicurezza</h3>
        <div id="security-log-list"></div>
    </div>

</div>

<script src="mega-dashboard.js"></script>
</body>
</html>
'@

# FRONTEND: mega-dashboard.js
Set-Content C:\booking-app\frontend\admin\mega-dashboard.js @'
const monitor = new WebSocket("ws://localhost:3001/monitor");
const processes = new WebSocket("ws://localhost:3001/processes");

async function loadSecurityLogs() {
    const res = await fetch("http://localhost:3001/admin/security-logs");
    const data = await res.json();
    const container = document.getElementById("security-log-list");
    container.innerHTML = "";

    data.logs.forEach(log => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p><strong>${log.type}</strong> - ${log.ip}</p>
            <p>${log.date}</p>
            <p>${log.details}</p>
            <hr>
        `;
        container.appendChild(div);
    });
}
loadSecurityLogs();

let labels = [];
let cpuData = [];
let ramData = [];
let rpsData = [];

const cpuChart = new Chart(document.getElementById("cpuChart"), {
    type: "line",
    data: { labels, datasets: [{ label: "CPU %", data: cpuData, borderColor: "red" }] }
});

const ramChart = new Chart(document.getElementById("ramChart"), {
    type: "line",
    data: { labels, datasets: [{ label: "RAM %", data: ramData, borderColor: "blue" }] }
});

const rpsChart = new Chart(document.getElementById("rpsChart"), {
    type: "line",
    data: { labels, datasets: [{ label: "RPS", data: rpsData, borderColor: "green" }] }
});

const uptimeGauge = new Chart(document.getElementById("uptimeGauge"), {
    type: "doughnut",
    data: {
        labels: ["Uptime", "Restante"],
        datasets: [{ data: [0, 100], backgroundColor: ["#4CAF50", "#ddd"] }]
    }
});

monitor.onmessage = (event) => {
    const data = JSON.parse(event.data);

    const timeLabel = new Date().toLocaleTimeString();
    labels.push(timeLabel);

    cpuData.push(data.cpu);
    ramData.push(data.ram);
    rpsData.push(data.rps);

    if (labels.length > 20) {
        labels.shift();
        cpuData.shift();
        ramData.shift();
        rpsData.shift();
    }

    cpuChart.update();
    ramChart.update();
    rpsChart.update();

    const uptimePercent = Math.min(100, (data.uptime / 86400) * 100);
    uptimeGauge.data.datasets[0].data = [uptimePercent, 100 - uptimePercent];
    uptimeGauge.update();

    document.getElementById("cpuAlarm").innerText =
        data.cpu > 90 ? "⚠️ ALLARME CPU > 90%" : "";

    document.getElementById("ramAlarm").innerText =
        data.ram > 80 ? "⚠️ ALLARME RAM > 80%" : "";
};

processes.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const container = document.getElementById("process-list");
    container.innerHTML = "";

    data.forEach(p => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p><strong>${p.name}</strong> (PID: ${p.pid})</p>
            <p>CPU: ${p.cpu}%</p>
            <p>RAM: ${p.ram} MB</p>
            <hr>
        `;
        container.appendChild(div);
    });
};
'@

# FRONTEND: styles.css
Set-Content C:\booking-app\frontend\admin\css\styles.css @'
body {
    font-family: Arial, sans-serif;
    background: #121212;
    color: #eee;
    margin: 0;
    padding: 20px;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.provider-card {
    background: #1e1e1e;
    border: 1px solid #333;
    padding: 15px;
    border-radius: 6px;
}
'@
