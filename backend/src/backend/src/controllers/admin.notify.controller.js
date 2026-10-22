import { pool } from "../config/db.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const notifyTopProviders = async (req, res) => {
  try {
    const top = await pool.query(`
      SELECT p.email, p.business_name, SUM(l.price) AS revenue
      FROM reservations r
      JOIN listings l ON r.listing_id = l.id
      JOIN providers p ON l.provider_id = p.id
      GROUP BY p.email, p.business_name
      ORDER BY revenue DESC
      LIMIT 3
    `);

    for (const provider of top.rows) {
      await sgMail.send({
        to: provider.email,
        from: "admin@booking-app.com",
        subject: "Complimenti! Sei tra i provider top",
        html: `
          <h2>Ciao ${provider.business_name},</h2>
          <p>Complimenti! Sei tra i provider con più ricavi.</p>
          <p>Hai generato: <strong>€${provider.revenue}</strong></p>
          <p>Continua così!</p>
        `
      });
    }

    res.json({ success: true, providers: top.rows });
  } catch (err) {
    console.error("Notify error:", err);
    res.status(500).json({ error: "Errore invio notifiche" });
  }
};


  
  