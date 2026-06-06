# E-commerce Shop (Vue Frontend)

Vue 3 frontend for the college e-commerce assignment. Connects to the PHP REST API backend for product browsing, cart/checkout, order history, and admin management.

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8000` (see `backend-server/` — run `docker compose up` and apply migrations)

## Setup

```sh
npm install
cp .env.example .env
```

For local development, leave `VITE_API_BASE_URL` empty or unset in `.env` so requests go through the Vite dev proxy (`/api` → `http://localhost:8000`).

For production builds, set:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Development

Start the dev server (default: `http://localhost:5173`):

```sh
npm run dev
```

The Vite proxy forwards `/api` and `/health` to the backend, avoiding CORS issues during development.

## Build

```sh
npm run build
```

## Lint & type-check

```sh
npm run lint
npm run type-check
```

## Features

- **Shop:** Browse products, filter by category, view product details, add to cart
- **Auth:** Login and register (customer or admin accounts)
- **Cart & checkout:** Update quantities, place orders with shipping details
- **Orders:** View order history and order details
- **Admin:** Dashboard stats, category/product CRUD, order management with status updates

## Typical workflow

1. Start the backend (`docker compose up` in `backend-server/`)
2. Start the frontend (`npm run dev`)
3. Register a customer → browse products → add to cart → checkout
4. Register an admin → open **Admin** in the nav → manage categories, products, and orders

Admins are redirected to `/admin` after login. Customers return to the page they were viewing or the shop home.
