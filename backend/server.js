import express from "express";
import cors from "cors";
import "./src/config/db.js";
import { initSchema } from "./schema-init.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import providerRoutes from "./src/routes/provider.js";
import listingRoutes from "./src/routes/listing.js";
import slotRoutes from "./src/routes/slot.js";
import reservationRoutes from "./src/routes/reservation.js";
import customerRoutes from "./src/routes/customer.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/customers', customerRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.json({ status: 'ok', service: 'BookHub API' }));

const PORT = process.env.APP_PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  initSchema().then(() => app.listen(PORT, () => console.log(`Backend running on port ${PORT}`)))
    .catch(error => { console.error('Schema initialization failed:', error); process.exit(1); });
}
export default app;
