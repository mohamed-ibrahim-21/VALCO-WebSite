# VALCO Website + Admin Dashboard

React/Vite frontend, Express API, MongoDB, JWT admin login, product management, editable homepage content, image uploads, and quote requests. Requires Node.js 20+ and MongoDB Atlas.

## Setup
1. Copy `server/.env.example` to `server/.env` and fill in your real MongoDB URI, a new long JWT secret, and a strong admin password. Never commit `.env`.
2. In one terminal: `cd server`, `npm install`, `npm run dev`.
3. In another terminal: `cd client`, `npm install`, `npm run dev`.
4. Open `http://localhost:5173`; admin login is `http://localhost:5173/admin/login`. Use ADMIN_EMAIL and ADMIN_PASSWORD from server/.env.

On startup the server creates the admin user only if that email does not already exist. If an old account already exists with a different password, reset that account in the database or use a fresh development database. Product images are saved in `server/uploads` for local development; use cloud object storage for production.
