import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/Dashboard";
import AnalyticsPro from "./pages/AnalyticsPro";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/analytics" element={<AnalyticsPro />} />   {/* ⭐ AGGIUNTO */}

        {/* DEFAULT */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

