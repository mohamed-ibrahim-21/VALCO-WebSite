import { Router } from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";

const r = Router();
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const clean = (t) => ({
  en: String(t?.en ?? "").trim().slice(0, 300),
  ar: String(t?.ar ?? "").trim().slice(0, 300),
});
function fields(b) {
  const out = {};
  if (b.name !== undefined) out.name = clean(b.name);
  if (b.description !== undefined) out.description = clean(b.description);
  if (b.image !== undefined) out.image = String(b.image || "").trim();
  if (b.order !== undefined) out.order = Number(b.order) || 0;
  if (b.active !== undefined) out.active = Boolean(b.active);
  if (b.parent !== undefined) out.parent = String(b.parent || "").trim();
  return out;
}
// A sub-category must sit under an existing main category (one level only).
async function checkParent(parent, selfSlug) {
  if (!parent) return null;
  if (parent === selfSlug) return "A category can't be inside itself.";
  const p = await Category.findOne({ slug: parent });
  if (!p || p.parent) return "Choose a main category as the parent.";
  if (selfSlug && (await Category.countDocuments({ parent: selfSlug })))
    return "This category has sub-categories, so it can't be moved under another one.";
  return null;
}

// Public list (active only). ?admin=true returns all, with how many products each has.
r.get("/", async (req, res, next) => {
  try {
    const admin = req.query.admin === "true";
    const list = await Category.find(admin ? {} : { active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    if (admin) {
      const counts = await Product.aggregate([
        { $group: { _id: "$categorySlug", n: { $sum: 1 } } },
      ]);
      const by = Object.fromEntries(counts.map((c) => [c._id, c.n]));
      list.forEach((c) => (c.productCount = by[c.slug] || 0));
    }
    res.json(list);
  } catch (e) {
    next(e);
  }
});

r.post("/", requireAdmin, async (req, res, next) => {
  try {
    const data = fields(req.body);
    if (!data.name?.en) return res.status(400).json({ message: "English category name is required." });
    const slug = slugify(req.body.slug || data.name.en) || `category-${Date.now()}`;
    const bad = await checkParent(data.parent, null);
    if (bad) return res.status(400).json({ message: bad });
    if (data.order === undefined) data.order = (await Category.countDocuments()) + 1;
    res.status(201).json(await Category.create({ ...data, slug }));
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "A category with this name already exists." });
    next(e);
  }
});

r.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const data = fields(req.body);
    if (data.name && !data.name.en)
      return res.status(400).json({ message: "English category name is required." });
    if (data.parent !== undefined) {
      const current = await Category.findById(req.params.id);
      if (!current) return res.status(404).json({ message: "Category not found." });
      const bad = await checkParent(data.parent, current.slug);
      if (bad) return res.status(400).json({ message: bad });
    }
    const c = await Category.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!c) return res.status(404).json({ message: "Category not found." });
    // Keep the copy of the names on products in sync.
    await Product.updateMany(
      { categorySlug: c.slug },
      { $set: { category: c.name.en, categoryAr: c.name.ar } },
    );
    res.json(c);
  } catch (e) {
    next(e);
  }
});

r.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const c = await Category.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Category not found." });
    const subs = await Category.countDocuments({ parent: c.slug });
    if (subs)
      return res.status(409).json({
        message: `This category has ${subs} sub-categor${subs === 1 ? "y" : "ies"}. Move or delete them first.`,
      });
    const n = await Product.countDocuments({ categorySlug: c.slug });
    if (n)
      return res.status(409).json({
        message: `This category still has ${n} product(s). Move them to another category first.`,
      });
    await c.deleteOne();
    res.json({ message: "Category deleted." });
  } catch (e) {
    next(e);
  }
});

export default r;
