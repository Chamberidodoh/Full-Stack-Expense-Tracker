# Full-Stack Expense Tracker

A production-ready expense tracker application with secure JWT authentication, MongoDB Atlas integration, real-time analytics, and full CRUD management.

## Tech stack
- Frontend: React, Vite, Tailwind CSS, React Router DOM, React Hook Form, Chart.js, React Toastify
- Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs, helmet, express-validator
- Deployment: Render + MongoDB Atlas

## Features
- Registration and login with JWT authentication
- Protected dashboard, expenses, analytics, and profile routes
- Full CRUD for expenses with search, filters, sorting, and pagination
- Income vs expense tracking, category breakdown, and monthly trend charts
- Profile update and password change endpoints
- Soft delete support for expenses
- Tailwind CSS responsive UI with toast notifications
- Render deployment configuration included

## Setup
1. Copy `.env.example` to `.env`
2. Copy `client/.env.example` to `client/.env`
3. Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`
4. Set `VITE_API_URL` in `client/.env` if needed
5. Run:
   - `npm install`
   - `npm run dev`

## Build for production
1. Build the frontend: `cd client && npm run build`
2. Start backend: `npm start`

## Folder structure
```
expense-tracker/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Expenses/
│   │   │   ├── Profile/
│   │   │   └── Analytics/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   ├── app.js
│   └── server.js
├── .env.example
├── client/.env.example
├── render.yaml
├── package.json
└── README.md
```

## Render deployment
- Backend service: `npm start`
- Frontend service: build `client/dist`
- Environment vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `VITE_API_URL`

## Notes
- The root package installs backend dependencies, then installs frontend dependencies via `postinstall`.
- Use the provided `client/.env.example` to configure the API endpoint for the React app.
