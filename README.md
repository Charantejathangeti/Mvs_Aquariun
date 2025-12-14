
This README will serve as the project's documentation, covering architecture, setup, deployment, and the highly specific business rules (WhatsApp sales flow, shipping logic, and CRUD administration).
README.md
🐠 Mvs_Aqua E-Commerce Platform
Welcome to the documentation for Mvs_Aqua, a specialized full-stack e-commerce platform built for high-touch, controlled aquatic sales. This system replaces traditional payment gateways with a mandatory, secure WhatsApp ordering and prepaid confirmation process.
🛠️ 1. Project Architecture
This project is a modern, decoupled monorepo structure utilizing the following technologies:
| Component | Technology | Role |
|---|---|---|
| Frontend | Next.js 14 (App Router) & TypeScript | Customer-facing UI, RBAC routing, Cart, and WhatsApp Redirect logic. |
| Backend | Node.js / Express (TypeScript) | REST API, Business Logic (Shipping/Invoicing), Security (JWT/RBAC), and Data Persistence (Mock/PostgreSQL). |
| Styling | Tailwind CSS | Utility-first styling using custom brand colors (deep-sea, coral-pop). |
⚙️ 2. Core Business Logic & Unique Features
Mvs_Aqua operates under strict business rules enforced by the system architecture:
2.1. WhatsApp-Only Sales Flow (CRITICAL)
 * No Payment Gateway: The website does not process payments directly (No UPI, Card, Net Banking integration).
 * Checkout Action: Upon clicking "Confirm Order," the system executes two actions:
   * Logs the order in the database (Status: PENDING_WHATSAPP).
   * Immediately redirects the customer's browser to the owner's WhatsApp number (+91 6302382280) with a hyper-encoded, pre-filled message containing the full order details, final total, and customer contact information.
 * Post-Order Instructions: The success page displays the Prepaid Instructions (including a QR code placeholder) and the Monday Dispatch Rule.
2.2. Two-Tier Shipping Formula (T.S. & A.P. Only)
Shipping is restricted to Telangana (T.S.) and Andhra Pradesh (A.P.) and is calculated based on total cart weight:
| Weight Tier | Cost (₹) | Implementation |
|---|---|---|
| Tier 1: Total Weight < 1kg | Flat ₹80 | Base rate applied. |
| Tier 2: Total Weight \ge 1kg | \lceil \text{Total Weight (kg)} \rceil \times 80 | Charged per kilogram (rounded up). |
2.3. Stock and Catalog Rules
 * Stock Status Logic: The frontend dynamically displays stock based on quantity:
   * stockCount > 10: "In Stock"
   * 1 <= stockCount <= 10: "Limited Stock"
   * stockCount == 0: "No Stock"
 * Quantity: Max quantity per product in the cart is limited to 50.
🔒 3. Security and Administration
3.1. Role-Based Access Control (RBAC)
The system enforces strict RBAC using JWTs. All API endpoints and frontend routes related to administration are protected.
| Role | Access | Permissions |
|---|---|---|
| OWNER/ADMIN | /admin/* | Full CRUD on products, view all orders, generate Dual Invoices. |
| CUSTOMER | / (Storefront), /cart/* | Browse products, place orders (via WhatsApp), view own order history. |
| Unauthenticated | /, /login | Browse products. |
3.2. Admin Management (CRUD)
The /admin/products/fish dashboard provides a full management interface:
 * CRUD API: The backend includes protected endpoints (POST, GET, PATCH, DELETE) for managing product details.
 * Admin UI: Allows for Inline Editing of critical fields: Price (₹), Stock Count, and Weight (g).
3.3. Dual Invoicing & Tracking
 * The backend generates two PDF invoices upon admin order confirmation: a Client Invoice and an internal Owner Audit Invoice.
 * A pre-written dispatch notification template, including the tracking link (https://www.tpcindia.com/), is provided to the admin for manual communication via WhatsApp.
🚀 4. Setup and Deployment
4.1. Prerequisites
 * Node.js (v18+) & npm
 * PostgreSQL (or utilize the mock DB for local development)
 * GitHub Account & Vercel Account (for deployment)
4.2. Local Development
 * Clone Repository:
   git clone mvs_aqua_project
cd mvs_aqua_project

 * Backend Setup (backend/)
   cd backend
npm install
cp .env.example .env # Set JWT_SECRET and DATABASE_URL
npm start # Starts the Express API on port 5000 (default)

 * Frontend Setup (frontend/)
   cd ../frontend
npm install
# Create .env.local and set API URL
# NEXT_PUBLIC_API_URL="http://localhost:5000/api"
npm run dev # Starts Next.js app on port 3000 (default)

4.3. Production Deployment (Vercel & Backend Host)
| Component | Host | Configuration Notes |
|---|---|---|
| Frontend | Vercel | Set root directory to frontend. Add NEXT_PUBLIC_API_URL environment variable. |
| Backend | Render, Railway, or VPS | Requires a separate Node.js hosting solution. Must be configured to run the backend/ directory. Secure your JWT_SECRET and DATABASE_URL environment variables. |
📞 5. Contact Information
Store Address:
15 Line, Upadhyaya Nagar, Tirupati, Andhra Pradesh 517507
Owner Contact:
+91 94902 55775 (Primary)
+91 6302382280 (WhatsApp Sales/Order Confirmation)

