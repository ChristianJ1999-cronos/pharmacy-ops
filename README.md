# Pharmacy Ops Laravel/PHP/React App

**React + Tailwind** frontend and **Laravel + MySQL** backend API.

This project demonstrates end-to-end workflows: listing orders with server-side filters/pagination, viewing order details with items, creating orders with validation, updating status, and deleting orders.

## Features
- ✅ Orders list (server-side pagination)
- ✅ Filtering:
  - status
  - search (patient name / external_rx_id)
- ✅ Order details page:
  - shows order metadata
  - shows order items
- ✅ Create order form:
  - dynamic order items
  - displays Laravel 422 validation errors
  - transactional create (order + items)
- ✅ Update order status (PATCH)
- ✅ Delete order (DELETE)
- ✅ MySQL-backed schema + relations (Order hasMany OrderItem)

## Tech Stack
- Backend: Laravel (PHP), MySQL
- Frontend: React, Tailwind CSS
- API: REST JSON endpoints under `/api/*`

## Project Structure
- Laravel app root: `/`
- React frontend: `/frontend`

## Requirements
- PHP 8.x + Composer
- Node 18+ (or newer)
- MySQL 8.x

## Setup & Run

### 1) Backend (Laravel)

#### Install dependencies + create .env
From the repo root (the folder containing `artisan` and `composer.json`):

**macOS / Linux**
```bash
composer install
cp .env.example .env
php artisan key:generate
```

**Windows PowerShell**
```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
```

#### Configure MySQL in `.env`
Create a MySQL database (example: `pharmacy_ops`) and set:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pharmacy_ops
DB_USERNAME=root
DB_PASSWORD=YOUR_PASSWORD
```

#### Migrate + seed
```bash
php artisan migrate:fresh --seed
```

#### Start the backend
```bash
php artisan serve

or

composer run dev
```

Backend runs at:
- http://127.0.0.1:8000

---

### 2) Frontend (React + Vite)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
- http://localhost:5173 (or next available port)

> The Vite dev server should proxy `/api/*` requests to the Laravel backend.

---

## API Endpoints

- `GET /api/orders`  
  Query params: `page`, `per_page`, `status`, `q`
- `GET /api/orders/{id}`
- `POST /api/orders`
- `PATCH /api/orders/{id}` (status update)
- `DELETE /api/orders/{id}`

---

## Example Create Payload

```json
{
  "external_rx_id": "RX-TEST-0001",
  "patient_name": "Test Patient",
  "status": "processing",
  "placed_at": "2026-02-19",
  "items": [
    { "drug_name": "Sample Drug", "ndc": "12345-6789-01", "quantity": 2, "price_cents": 799 }
  ]
}
```

---

## Security / Repo Hygiene Notes
- ✅ **Do not commit `.env`** (it contains secrets).  
  Only commit `.env.example`.
- ✅ Do not commit `vendor/`, `node_modules/`, or build artifacts.
- ✅ Use dummy/test data only.
