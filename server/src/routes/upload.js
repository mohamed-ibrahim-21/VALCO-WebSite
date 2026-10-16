import { Router } from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { requireAdmin } from "../middleware/auth.js";
const r = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(
      null,
      crypto.randomUUID() + path.extname(file.originalname).toLowerCase(),
    ),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    cb(
      null,
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.mimetype,
      ),
    ),
});
r.post("/", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ message: "Choose a JPG, PNG, WEBP or GIF image." });
  res.status(201).json({ url: "/uploads/" + req.file.filename });
});
export default r;
