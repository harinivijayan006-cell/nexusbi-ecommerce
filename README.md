# NexusBI — Data-Driven E-Commerce & Business Intelligence Platform (2026)

A production-grade, full-stack, data-driven e-commerce platform with an integrated Business Intelligence (BI) Admin Dashboard. Engineered to showcase enterprise-level software design: relational data modeling, transactional guarantees, real-time SQL aggregation, interactive analytics visualizations, and multi-facet commerce workflows.

---

## 🚀 Key Features

### 🛒 Customer-Facing Storefront
- **Modern Catalog**: Search keywords across names, descriptions, and brands. Filter by category, price ranges, star ratings, and inventory availability.
- **Dynamic Product Pages**: High-resolution image galleries, real-time stock buffer indicators (`Only X left!`), reviews lists, and related items.
- **Interactive Customer Reviews**: Submit ratings & comments written directly to PostgreSQL with automatic recalculation of average star scores.
- **Cart & Instant Checkout**: Real-time tax (8%), dynamic free shipping threshold bar ($150), promo code discounts (`NEXUS10`, `WELCOME20`).
- **Transactional Stock Decrementing**: Inventory quantities automatically adjust upon order placement inside relational transactions.
- **Live Order Tracking**: Visual fulfillment status stepper (Placed &rarr; Processing &rarr; Shipped &rarr; Delivered) with receipt summaries.
- **1-Click Persona Switcher**: Instantly swap between "Admin Director" and customers ("Sarah Connor", "David Miller", etc.) directly in the header.

### 📊 Business Intelligence (BI) Admin Portal
- **Executive KPIs**: Real-time computation of **Total Revenue**, **Total Orders**, **Average Order Value (AOV)**, **Active Customers**, **Catalog SKUs**, and **Conversion Rates** via SQL aggregation (`SUM`, `AVG`, `COUNT`, `GROUP BY`).
- **Interactive Chart.js Visualizations**:
  - Revenue & Orders Timeline (Line Chart with dual-axis scaling)
  - Sales by Category (Doughnut Chart)
  - Top Revenue-Generating SKUs (Horizontal Bar Chart)
  - Order Fulfillment Lifecycle Distribution (Donut Chart)
- **Automated Rule-Based AI/BI Insights**:
  - Top revenue-contributing department and dollar amount
  - Velocity product identification (top-selling SKU by units)
  - Critical inventory threshold buffer alerts ($\le 8$ units)
  - VIP customer acquisition and spend concentration
- **Full Product CRUD**: Add, edit, or delete SKUs, adjust pricing, update discount tiers, and modify descriptions.
- **Fulfillment Management**: Update order lifecycle states (`Confirmed` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered` &rarr; `Cancelled`).
- **Inventory Restock Trigger**: 1-click $+25$ unit inventory replenishment directly on low-stock items.
- **Data Analyst CSV Exports**: Direct streaming downloads for **Sales Reports**, **Customer Lifetime Spend**, **Orders Master**, and **Inventory Catalog**.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Chart.js, Lucide Icons |
| **Backend** | Node.js, Express.js, RESTful API Architecture |
| **Database** | PostgreSQL (Relational Instance), Drizzle ORM, Drizzle Kit |
| **Authentication** | Firebase Authentication + Stateless Session Tokens (RBAC) |
| **Connection Pooling** | `pg.Pool` Object Configuration with idle error handling |

---

## 🗄 Relational Database Schema

```
categories (1) ────< (N) products (1) ────< (N) order_items (N) >──── (1) orders
                                                  │                        │
                                                 (N)                      (1)
                                                  │                        │
users (1) ────────────────────────────────────────┼──────────< (N) ────────┴─── (1) payments
   │                                              │
  (1) ────< (N) reviews (N) >─────────────────────┘
   │
  (1) ────< (1) carts (1) ────< (N) cart_items
```

### Tables Summary:
1. `users`: Customer profiles, role (`admin` vs `customer`), auth UID, contact info.
2. `categories`: Departments, descriptions, icons, image URLs.
3. `products`: SKUs, pricing, discount percentage, stock, ratings, views count.
4. `carts` & `cart_items`: User carts with product mappings and quantities.
5. `orders`: Order number (`ORD-2026-XXXX`), shipping addresses, totals, statuses.
6. `order_items`: Snapshotted unit prices, line totals, and product foreign keys.
7. `payments`: Payment methods, transaction IDs, completion statuses.
8. `reviews`: User reviews, 1-5 star ratings, comments with timestamps.

---

## 🔌 API Endpoints Summary

### Authentication & Users
- `POST /api/auth/register` — Create new account
- `POST /api/auth/login` — Login with email
- `GET /api/auth/me` — Current authenticated session
- `GET /api/auth/demo-users` — Retrieve seeded accounts for persona testing
- `GET /api/users` — Admin customer list with order counts & total spend

### Catalog & Commerce
- `GET /api/categories` — List all departments with product counts
- `GET /api/products` — Filterable product search (category, price, rating, stock, sort)
- `GET /api/products/:id` — Single product details + reviews + related SKUs
- `POST /api/products` — Create product (Admin)
- `PUT /api/products/:id` — Update product details (Admin)
- `DELETE /api/products/:id` — Delete product (Admin)
- `POST /api/products/:id/reviews` — Submit customer review

### Cart & Orders
- `GET /api/cart` — Retrieve active cart items
- `POST /api/cart` — Add product to cart
- `PUT /api/cart/:itemId` — Update quantity
- `DELETE /api/cart/:itemId` — Remove item
- `GET /api/orders` — Orders list (scoped to user or all for admin)
- `GET /api/orders/:id` — Order receipt breakdown
- `POST /api/orders` — Place order, deduct stock, create payment record
- `PUT /api/orders/:id/status` — Update order status (Admin)

### Business Intelligence & Exports
- `GET /api/analytics/dashboard` — Executive KPIs & automated rule-based insights
- `GET /api/analytics/sales` — Timeline revenue and orders data for Chart.js
- `GET /api/analytics/categories` — Category revenue distribution
- `GET /api/analytics/products` — Top sellers and low stock SKU alerts
- `GET /api/analytics/customers` — Customer cohorts and spend distribution
- `GET /api/export/sales` — Downloadable Sales CSV
- `GET /api/export/customers` — Downloadable Customer Lifetime Value CSV
- `GET /api/export/orders` — Downloadable Orders CSV
- `GET /api/export/products` — Downloadable Inventory CSV

---

## 💻 Development & Deployment

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Port 3000)
npm run dev

# 3. Production Build
npm run build
npm start
```

### Demo Product Catalog
The bulk catalog is generated in PostgreSQL and is never bundled into the frontend. Configure `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, and `SQL_DB_NAME`, apply `database/schema.sql`, then run:

```bash
npm run seed:bulk
```

This creates 100,000 paginated demo records across 13 major departments and their subcategories. Generated prices are illustrative; ratings, reviews, stock, merchant URLs, and live merchant feeds are not fabricated as verified data. The seed removes and recreates only products whose SKU starts with `BULK-`.
