import { Router } from "express";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";
const r = Router();
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || `product-${Date.now()}`;
r.get("/", async (req, res, next) => {
  try {
    res.json(
      await Product.find(
        req.query.admin === "true" ? {} : { active: true },
      ).sort({ featured: -1, createdAt: -1 }),
    );
  } catch (e) {
    next(e);
  }
});
r.post("/", requireAdmin, async (req, res, next) => {
  try {
    if (!req.body.name?.en?.trim())
      return res
        .status(400)
        .json({ message: "English product name is required." });
    res
      .status(201)
      .json(
        await Product.create({
          ...req.body,
          slug: req.body.slug || slugify(req.body.name.en),
        }),
      );
  } catch (e) {
    if (e.code === 11000)
      return res
        .status(409)
        .json({ message: "Product slug or SKU already exists." });
    next(e);
  }
});
r.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!p) return res.status(404).json({ message: "Product not found." });
    res.json(p);
  } catch (e) {
    if (e.code === 11000)
      return res.status(409).json({ message: "Product slug already exists." });
    next(e);
  }
});
r.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted." });
  } catch (e) {
    next(e);
  }
});
export default r;
