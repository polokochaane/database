# WASCO Water Billing Application

A full-stack web application for managing water billing, customers, payments, and admin tasks.

## Features
- Customer management (CRUD)
- Billing generation and tracking
- Payment processing
- Admin dashboard
- Responsive frontend

## Tech Stack
- **Backend:** Node.js + Express.js + PostgreSQL (two DBs: main + payments)
- **Frontend:** HTML5 + CSS + Vanilla JavaScript
- **Database:** PostgreSQL

## Quick Start
1. Backend setup:
   ```
   cd backend
   npm install
   # Configure DB in config/postgresDB.js and paymentDB.js
   node server.js
   ```
2. Frontend: Open `frontend/wasco_water_billing_app.html` in browser (connects to backend API).

## API Endpoints
- `/api/customers` - Customer routes
- `/api/billing` - Billing
- `/api/payments` - Payments
- `/api/admin` - Admin

## Project Structure
```
.
├── backend/     # Express server, routes, controllers, config
└── frontend/    # Static HTML/CSS/JS app
├── README.md
└── .gitignore
```

## Deployment
- Render: deploy this repo using the included `render.yaml`
- The Express app serves both the API and the static frontend from one Render web service

### Render setup
1. Push this repo to GitHub.
2. In Render, create a new Blueprint and select the repo.
3. Set these environment variables in Render:
   - `PG_HOST`
   - `PG_PORT`
   - `PG_USER`
   - `PG_PASSWORD`
   - `PG_DATABASE`
   - `PG_SSL=true`
4. Deploy the `wasco-water-billing` service.

The app now uses `process.env.PORT` on Render and serves the frontend from the backend service root.

License: MIT
