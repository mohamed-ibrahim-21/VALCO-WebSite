import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Admin from "./models/Admin.js";
import auth from "./routes/auth.js";
import products from "./routes/products.js";
import site from "./routes/site.js";
import quotes from "./routes/quotes.js";
import upload from "./routes/upload.js";
const app = express(),
  dir = path.dirname(fileURLToPath(import.meta.url));
if (!process.env.MONGODB_URI)
  throw Error("MONGODB_URI missing from server/.env");
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
  throw Error("JWT_SECRET must be at least 32 characters");
// CLIENT_ORIGIN can hold several comma-separated URLs (e.g. the Vercel site and localhost).
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);
app.use(cors({ origin: origins }));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.resolve(dir, "../uploads")));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", auth);
app.use("/api/products", products);
app.use("/api/site", site);
app.use("/api/quotes", quotes);
app.use("/api/upload", upload);
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError")
    return res.status(400).json({ message: err.message });
  if (err.name === "CastError")
    return res.status(400).json({ message: "Invalid ID." });
  if (err.code === "LIMIT_FILE_SIZE")
    return res.status(400).json({ message: "Image must be 5 MB or smaller." });
  res.status(500).json({ message: "Server error. Check server terminal." });
});
const port = Number(process.env.PORT || 5000);
async function start() {
  const dbName = process.env.MONGODB_DB || "VALCO";
  await mongoose.connect(process.env.MONGODB_URI, { dbName });
  console.log(`MongoDB connected (database: ${dbName})`);
  const email = String(process.env.ADMIN_EMAIL || "")
      .trim()
      .toLowerCase(),
    password = String(process.env.ADMIN_PASSWORD || "");
  if (email && password && !(await Admin.findOne({ email }))) {
    await Admin.create({
      email,
      passwordHash: await bcrypt.hash(password, 12),
    });
    console.log("Initial admin created:", email);
  } else if (email)
    console.log("Admin already exists; existing password was not changed.");
  app.listen(port, () => console.log(`VALCO API listening on port ${port}`));
}
start().catch((e) => {
  console.error("Startup failed:", e.message);
  process.exit(1);
});
