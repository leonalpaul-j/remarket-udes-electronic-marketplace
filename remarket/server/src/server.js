import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import requirementRoutes from './routes/requirements.js';
import auctionRoutes from './routes/auctions.js';
import adminRoutes from './routes/admin.js';
import orderRoutes from './routes/orders.js';
import notificationRoutes from './routes/notifications.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'ReMarket API' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error.' });
});

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`ReMarket API running on port ${port}`)))
  .catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
