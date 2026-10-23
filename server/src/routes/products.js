import { Router } from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { requireAdmin } from "../middleware/auth.js";
const r = Router();
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || `product-${Date.now()}`;
// Copy the chosen category's names onto the product so lists can show them directly.
async function withCategory(body) {
  if (body.categorySlug === undefined) return body;
  const c = body.categorySlug ? await Category.findOne({ slug: body.categorySlug }) : null;
  return {
    ...body,
    categorySlug: c ? c.slug : "",
    category: c ? c.name.en : "",
    categoryAr: c ? c.name.ar : "",
  };
}
r.get("/", async (req, res, next) => {
  try {
    const filter = req.query.admin === "true" ? {} : { active: true };
    if (req.query.category) filter.categorySlug = String(req.query.category);
    res.json(await Product.find(filter).sort({ featured: -1, createdAt: -1 }));
  } catch (e) {
    next(e);
  }
});
r.get("/slug/:slug", async (req, res, next) => {
  try {
    const p = await Product.findOne({ slug: req.params.slug, active: true });
    if (!p) return res.status(404).json({ message: "Product not found." });
    res.json(p);
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
          ...(await withCategory(req.body)),
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
    const p = await Product.findByIdAndUpdate(req.params.id, await withCategory(req.body), {
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
