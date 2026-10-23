import { Router } from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "node:path";
import Download from "../models/Download.js";
import { requireAdmin } from "../middleware/auth.js";

const r = Router();
const MAX_MB = 15;
const TYPES = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".zip": "application/zip",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, Boolean(TYPES[path.extname(file.originalname).toLowerCase()])),
});
const bucket = () => new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "downloads" });
const clean = (t) => ({
  en: String(t?.en ?? "").trim().slice(0, 200),
  ar: String(t?.ar ?? "").trim().slice(0, 200),
});
const parseJson = (v) => {
  try {
    return typeof v === "string" ? JSON.parse(v) : v;
  } catch {
    return undefined;
  }
};

r.get("/", async (req, res, next) => {
  try {
    const all = req.query.admin === "true";
    res.json(await Download.find(all ? {} : { active: true }).sort({ order: 1, createdAt: -1 }));
  } catch (e) {
    next(e);
  }
});

// The file itself. ?download=1 forces "save as"; otherwise PDFs open in the browser.
r.get("/:id/file", async (req, res, next) => {
  try {
    const d = await Download.findById(req.params.id);
    if (!d || (!d.active && req.query.preview !== "admin"))
      return res.status(404).json({ message: "File not found." });
    const name = encodeURIComponent(d.filename);
    res.setHeader("Content-Type", d.contentType);
    if (d.size) res.setHeader("Content-Length", d.size);
    res.setHeader(
      "Content-Disposition",
      `${req.query.download ? "attachment" : "inline"}; filename*=UTF-8''${name}`,
    );
    res.setHeader("Cache-Control", "public, max-age=3600");
    bucket()
      .openDownloadStream(d.fileId)
      .on("error", () => !res.headersSent ? res.status(404).end() : res.end())
      .pipe(res);
  } catch (e) {
    next(e);
  }
});

r.post("/", requireAdmin, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ message: `Choose a PDF, Word, Excel, ZIP or image file (max ${MAX_MB} MB).` });
    const title = clean(parseJson(req.body.title));
    if (!title.en && !title.ar) title.en = path.parse(req.file.originalname).name;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = path.basename(req.file.originalname).replace(/[\r\n"]/g, "");
    const fileId = await new Promise((resolve, reject) => {
      const up = bucket().openUploadStream(filename, { contentType: TYPES[ext] });
      up.on("error", reject).on("finish", () => resolve(up.id));
      up.end(req.file.buffer);
    });
    const doc = await Download.create({
      title,
      description: clean(parseJson(req.body.description)),
      fileId,
      filename,
      contentType: TYPES[ext],
      size: req.file.size,
      order: Number(req.body.order) || (await Download.countDocuments()) + 1,
    });
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});

r.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const data = {};
    if (req.body.title !== undefined) data.title = clean(req.body.title);
    if (req.body.description !== undefined) data.description = clean(req.body.description);
    if (req.body.order !== undefined) data.order = Number(req.body.order) || 0;
    if (req.body.active !== undefined) data.active = Boolean(req.body.active);
    const d = await Download.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!d) return res.status(404).json({ message: "File not found." });
    res.json(d);
  } catch (e) {
    next(e);
  }
});

r.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const d = await Download.findById(req.params.id);
    if (!d) return res.status(404).json({ message: "File not found." });
    await bucket()
      .delete(d.fileId)
      .catch(() => {}); // already gone is fine
    await d.deleteOne();
    res.json({ message: "File deleted." });
  } catch (e) {
    next(e);
  }
});

export default r;
