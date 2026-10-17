# VALCO Website + Admin Dashboard

React/Vite frontend, Express API, MongoDB, JWT admin login, product management, editable homepage content, image uploads, and quote requests. Requires Node.js 20+ and MongoDB Atlas.

## Setup
1. Copy `server/.env.example` to `server/.env` and fill in your real MongoDB URI, a new long JWT secret, and a strong admin password. Never commit `.env`.
2. In one terminal: `cd server`, `npm install`, `npm run dev`.
3. In another terminal: `cd client`, `npm install`, `npm run dev`.
4. Open `http://localhost:5173`; admin login is `http://localhost:5173/admin/login`. Use ADMIN_EMAIL and ADMIN_PASSWORD from server/.env.

On startup the server creates the admin user only if that email does not already exist. If an old account already exists with a different password, reset that account in the database or use a fresh development database. Product images are saved in `server/uploads` for local development; use cloud object storage for production.

## Free hosting (Vercel + Render + MongoDB Atlas + Cloudinary)
- **Database — MongoDB Atlas (M0 free):** in Network Access allow `0.0.0.0/0`, because Render's IPs change.
- **Images — Cloudinary (free plan):** copy the "API environment variable" (`cloudinary://...`) from the dashboard. Render's disk is wiped on every restart, so uploads must not be stored locally in production.
- **API — Render (free web service):** New → Web Service from this repo. Root Directory `server`, Build `npm install`, Start `npm start`, Health check path `/api/health`. Environment variables: everything in `server/.env.example`, with `CLOUDINARY_URL` set and `CLIENT_ORIGIN` set to your Vercel URL. Free services sleep after 15 minutes idle and take about a minute to wake up.
- **Website — Vercel (Hobby):** import this repo, Root Directory `client`, framework Vite, environment variable `VITE_API_URL` = your Render URL (no trailing slash). `client/vercel.json` makes direct links such as `/products/...` and `/admin` work. On Netlify, `client/public/_redirects` does the same.
