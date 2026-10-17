import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "../middleware/auth.js";

const r = Router();

// Production (Render etc.): images go to Cloudinary, because the server's disk is wiped on restart.
// Local development: if Cloudinary isn't configured, images are saved in server/uploads.
const useCloudinary = Boolean(
  process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET),
);
if (useCloudinary && !process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}
console.log(
  useCloudinary
    ? "Image uploads: Cloudinary"
    : "Image uploads: local disk (server/uploads) — set CLOUDINARY_* for production",
);

const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        fs.mkdirSync("uploads", { recursive: true });
        cb(null, "uploads");
      },
      filename: (req, file, cb) =>
        cb(null, crypto.randomUUID() + path.extname(file.originalname).toLowerCase()),
    });
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, allowed.includes(file.mimetype)),
});

function toCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: process.env.CLOUDINARY_FOLDER || "valco", resource_type: "image" },
        (err, result) => (err ? reject(err) : resolve(result)),
      )
      .end(buffer);
  });
}

r.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "Choose a JPG, PNG, WEBP or GIF image." });
  try {
    if (useCloudinary) {
      const result = await toCloudinary(req.file.buffer);
      return res.status(201).json({ url: result.secure_url });
    }
    res.status(201).json({ url: "/uploads/" + req.file.filename });
  } catch (e) {
    console.error("Image upload failed:", e.message);
    res.status(502).json({ message: "Image upload failed. Check the Cloudinary settings on the server." });
  }
});

export default r;
