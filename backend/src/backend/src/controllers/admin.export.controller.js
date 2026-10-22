import { getAdminStatsService } from "../services/admin.stats.service.js";
import PDFDocument from "pdfkit";

export const exportAnalyticsCSV = async (req, res) => {
  try {
    const stats = await getAdminStatsService();

    let csv = "metric,value\n";
    csv += `totalProviders,${stats.totalProviders}\n`;
    csv += `totalUsers,${stats.totalUsers}\n`;
    csv += `totalReservations,${stats.totalReservations}\n`;
    csv += `totalRevenue,${stats.totalRevenue}\n`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=analytics.csv");
    res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ error: "Errore esportazione CSV" });
  }
};

export const exportAnalyticsPDF = async (req, res) => {
  try {
    const stats = await getAdminStatsService();

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=analytics.pdf");

    doc.fontSize(22).text("Analytics Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Provider totali: ${stats.totalProviders}`);
    doc.text(`Clienti totali: ${stats.totalUsers}`);
    doc.text(`Prenotazioni totali: ${stats.totalReservations}`);
    doc.text(`Ricavi totali: €${stats.totalRevenue}`);

    doc.end();
    doc.pipe(res);
  } catch (err) {
    console.error("PDF export error:", err);
    res.status(500).json({ error: "Errore esportazione PDF" });
  }
};



