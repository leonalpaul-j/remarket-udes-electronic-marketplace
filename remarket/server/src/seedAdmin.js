import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';

await connectDB();
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in .env first.');
  process.exit(1);
}
const existing = await User.findOne({ email: email.toLowerCase() });
if (existing) {
  console.log('Admin email already exists. No changes made.');
} else {
  await User.create({
    name: process.env.ADMIN_NAME || 'ReMarket Admin',
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 12),
    role: 'admin'
  });
  console.log(`Admin created: ${email}`);
}
process.exit(0);
