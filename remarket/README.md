# ReMarket — Electronics B2B Marketplace

A beginner-friendly full-stack starter implementation using React, Vite, Bootstrap 5, Node.js, Express, MongoDB, and Mongoose.

## Included in this ZIP
- React responsive interface with navigation, product catalogue, first-/second-/third-hand and scrap filters
- Registration and login with hashed passwords and JWT authentication
- Role-based access (`buyer`, `supplier`, `recycler`, `admin`)
- Product listing creation with local image upload (JPG/PNG/WEBP/GIF, up to 5 MB) and admin approval/rejection
- Buyer bulk requirements (RFQs) and supplier quotations
- Buyer ordering from approved product listings, persistent supplier notifications, and supplier order status management
- Basic auction creation and bidding validation
- MongoDB persistence and environment-based configuration
- Admin seed script and setup instructions

**Important:** This is a working project foundation, not a production-certified marketplace. Email verification, password reset email delivery, external email/WhatsApp notifications, payment processing, robust concurrent-bid locking, and full business verification are not implemented. Do not use real customer data or deploy publicly without a security review.

## Requirements
- Node.js 20+
- MongoDB Community running locally, or a MongoDB Atlas connection string
- VS Code (recommended)

## 1. Configure the backend
Open a terminal in `remarket/server`:

```bash
npm install
```

Copy `.env.example` to `.env` and edit it:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/remarket
JWT_SECRET=replace_this_with_a_long_random_secret
ADMIN_NAME=ReMarket Admin
ADMIN_EMAIL=admin@remarket.local
ADMIN_PASSWORD=ChangeMe_12345
CLIENT_URL=http://localhost:5173
```

Create the initial admin:

```bash
npm run seed:admin
```

Start the API:

```bash
npm run dev
```

API health check: `http://localhost:5000/api/health`

## 2. Configure the frontend
Open a second terminal in `remarket/client`:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## 3. Test the core flow
1. Register as a buyer.
2. Log in and create a bulk requirement (for example, 1,000 desktop computers).
3. Register a separate supplier account.
4. Browse requirements and submit a quotation.
5. Log back in as the buyer and review quotations in the requirement section/API.
6. Create a product listing as supplier. It remains pending until admin approval.
7. Log in as the seeded admin to approve products.
8. Create an auction as supplier and bid as a different account.

## Notes
- The seeded admin credentials come from your `.env`. Change them before use.
- The app intentionally does not let users select `admin` at registration.
- For production, add email verification, password reset, email delivery, rate limiting, robust upload handling, audit logging, tests, and a transaction/payment provider.


### Product images not appearing?
Uploaded images are served by the backend at `http://localhost:5000/uploads/...`. The frontend now converts stored relative image paths such as `/uploads/example.jpg` into the backend URL, so they load from the marketplace correctly.

**Important:** new product listings are submitted with `pending` status and do not appear in the public marketplace until an administrator approves them in the Admin Dashboard. After approval, refresh the Marketplace page.


## Buyer orders and supplier notifications
1. Log in using a buyer account and open an approved product listing.
2. Select **Order now**, enter a quantity within the available stock/minimum order rules, and confirm.
3. The order is saved in MongoDB and a notification is stored for the supplier.
4. The supplier logs in and opens **Dashboard** to view notifications and orders, then accepts or rejects the order.
5. The buyer can see the supplier's order status from their own Dashboard.

Notifications are in-app notifications stored in MongoDB. This implementation does not send SMS, WhatsApp messages, or emails.
