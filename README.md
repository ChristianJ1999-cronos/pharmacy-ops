# Pharmacy Ops

A full-stack pharmacy operations dashboard built with React and Laravel.

🟢 **Live Demo:** https://pharmacy-ops.vercel.app/orders
> ⚠️ Hosted on Render's free tier — first load may take ~30 seconds to wake up the server.


---

## Overview

Pharmacy Ops is an internal-style ops dashboard that demonstrates end-to-end full-stack workflows — server-side filtering, pagination, relational data, transactional writes, and REST API design.

## Features
- Orders list with server-side pagination, filtering by status, and search by patient name / RX ID
- Order details page showing order metadata and line items
- Create order form with dynamic items and Laravel 422 validation errors
- Update order status (PATCH)
- Delete order with optimistic UI update
- PostgreSQL-backed schema with Order → OrderItems relationship
- Atomic order creation using DB transactions

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React 19, Tailwind CSS, Vite |
| Backend | Laravel 12 (PHP 8.4) |
| Database | PostgreSQL |
| Deployment | Vercel (frontend) + Render (backend) |

## API Endpoints
- `GET /api/orders` — list with pagination, filtering, sorting
- `GET /api/orders/{id}` — order detail with items
- `POST /api/orders` — create order + items (transactional)
- `PATCH /api/orders/{id}` — update status
- `DELETE /api/orders/{id}` — delete order

## Local Setup

### Backend
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```