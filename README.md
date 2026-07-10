# E-Commerce-Backend
Production-grade multi-seller e-commerce marketplace backend built with Node.js, Express &amp; MongoDB — supports order splitting, product variants, and secure checkout flows.

# 🛒 E-Commerce Backend (Flipkart-style Marketplace API)

A production-grade, multi-seller e-commerce backend built with **Node.js**, **Express**, and **MongoDB**. Supports product variants, seller-split orders, Stripe payments, coupons, reviews, and admin analytics — designed to mirror how real marketplaces like Flipkart/Amazon structure their systems.

---

## 📌 Features

- **Authentication** — JWT access + refresh tokens, role-based access (customer / seller / admin)
- **Multi-seller marketplace** — sellers manage their own products and orders independently
- **Product variants** — size/color/SKU-level pricing and stock (not just single-price products)
- **Cart & Checkout** — one order split into per-seller sub-orders automatically
- **Payments** — Stripe integration with idempotent webhook handling
- **Atomic stock management** — prevents overselling under concurrent checkouts
- **Coupons & discounts** — percentage/flat, category-restricted, usage-limited
- **Reviews & ratings** — verified-purchase badges, denormalized rating averages
- **Wishlist**
- **Admin dashboard APIs** — sales analytics via MongoDB aggregation pipelines
- **Rate limiting** — Redis-backed, protects auth and checkout routes
- **Email notifications** — order confirmations via Nodemailer

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Auth | JWT (access + refresh tokens) |
| Cache / Rate limiting | Redis |
| Payments | Stripe |
| File storage | Cloudinary |
| Validation | Zod |
| Testing | Jest + Supertest |

---

## 📂 Folder Structure

```
e-commerce-backend/
├── src/
│   ├── config/          # DB, Redis, Stripe, Cloudinary configs
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route handlers (thin — delegate to services)
│   ├── routes/          # Express routers
│   ├── middlewares/     # Auth, error handling, rate limiting, validation
│   ├── services/        # Business logic (checkout, stock, payments)
│   ├── validators/      # Zod request schemas
│   ├── utils/           # ApiError, ApiResponse, asyncHandler, helpers
│   ├── jobs/            # Cron/background jobs
│   └── app.js
├── tests/
├── public/temp/         # Temp storage before Cloudinary upload
├── .env.sample
├── package.json
└── server.js
```

---

## 🗄️ Data Models

| Model | Purpose |
|---|---|
| `User` | Account, auth, role |
| `Address` | Saved shipping addresses (1:N with User) |
| `Seller` | Business profile, payouts, commission |
| `Category` | Nested category tree |
| `Product` | Catalog item with embedded variants (SKU, price, stock) |
| `Cart` | Per-user cart with SKU-level items |
| `Order` | Customer-facing order (one per checkout) |
| `SubOrder` | Per-seller shipment split from an Order |
| `Payment` | Stripe payment records, refunds |
| `Review` | Ratings tied to verified purchases |
| `Coupon` | Discount codes |
| `Wishlist` | Saved products per user |

> **Key design decision:** a single checkout creates **one `Order`** (what the customer sees) split into **multiple `SubOrder`s** — one per seller — since each seller ships and gets paid independently. All order items store **snapshots** (title, price, image) rather than live references, so historical orders never change if a product is edited later.

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/logout
```

### Users & Addresses
```
GET    /api/users/me
PATCH  /api/users/me
GET    /api/users/addresses
POST   /api/users/addresses
PATCH  /api/users/addresses/:id
DELETE /api/users/addresses/:id
```

### Products
```
GET    /api/products                  (filters: category, price range, brand, search)
GET    /api/products/:id
POST   /api/products                  (seller only)
PATCH  /api/products/:id              (seller only, own product)
DELETE /api/products/:id              (seller only, own product)
```

### Cart
```
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:sku
DELETE /api/cart/items/:sku
```

### Orders
```
POST   /api/orders                    (checkout → creates Order + SubOrders + payment intent)
GET    /api/orders                    (logged-in user's orders)
GET    /api/orders/:id
PATCH  /api/orders/:id/sub-orders/:subOrderId/status   (seller/admin only)
```

### Payments
```
POST   /api/payments/webhook          (Stripe webhook — idempotent)
```

### Reviews
```
POST   /api/products/:id/reviews
GET    /api/products/:id/reviews
```

### Coupons
```
POST   /api/coupons/apply
GET    /api/coupons                   (admin only)
POST   /api/coupons                   (admin only)
```

### Wishlist
```
GET    /api/wishlist
POST   /api/wishlist/:productId
DELETE /api/wishlist/:productId
```

### Admin
```
GET    /api/admin/analytics           (revenue, top products, sales by category)
GET    /api/admin/sellers/pending
PATCH  /api/admin/sellers/:id/approve
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Redis
- Stripe account (test mode keys)
- Cloudinary account

### Installation

```bash
git clone <your-repo-url>
cd e-commerce-backend
npm install
```

### Environment Variables

Copy `.env.sample` to `.env` and fill in the values:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

REDIS_URL=redis://localhost:6379

STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Run the server

```bash
# development
npm run dev

# production
npm start
```

### Run tests

```bash
npm test
```

---

## 🧠 Hard Problems Solved Here

1. **Preventing overselling** — stock is decremented using an atomic `findOneAndUpdate` with a `stock: { $gte: quantity }` guard, so concurrent checkouts on the last unit can never both succeed.
2. **Idempotent payment webhooks** — Stripe can send the same event more than once; `stripePaymentIntentId` has a unique index so duplicate events are safely ignored.
3. **Multi-seller order splitting** — a single checkout is decomposed into per-seller `SubOrder`s at the service layer, each with its own status lifecycle and tracking info.
4. **Money handling** — all prices are stored as integers (paise/cents) to avoid floating-point rounding bugs.
5. **Historical data integrity** — order items and shipping addresses are stored as snapshots, not live references, so past orders remain accurate even if products or addresses change later.

---

## 🗺️ Roadmap

- [ ] Phase 1: Auth & user management
- [ ] Phase 2: Product catalog & cart
- [ ] Phase 3: Checkout, payments & seller-split orders
- [ ] Phase 4: Reviews, coupons, admin analytics, tests


---

## 🙋 Author

Built while learning backend development with Node.js & Express.
