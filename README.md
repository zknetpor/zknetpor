# Noira Gamis - Fullstack E-Commerce

Stack:
- Next.js 14 App Router
- Tailwind CSS + Framer Motion
- MongoDB + Mongoose
- JWT/NextAuth
- Midtrans Snap + webhook
- Cloudinary upload

## Run
1. Copy `.env.example` to `.env.local`
2. Install: `npm install`
3. Dev: `npm run dev`

## API Endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET/POST `/api/products`
- PUT/DELETE `/api/products/:id`
- GET/POST `/api/cart`
- POST/GET `/api/orders`
- PATCH `/api/orders/:id`
- POST `/api/payment/midtrans`
- POST `/api/payment/webhook`

## Security
- bcrypt hash password
- JWT protection + middleware admin
- basic rate limit
- sanitization input sederhana
