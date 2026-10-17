import { Router } from "express";
import Quote from "../models/Quote.js";
import { requireAdmin } from "../middleware/auth.js";
const r = Router();
r.post("/", async (req, res, next) => {
  try {
    const b = req.body || {};
    // A message is required for general enquiries; product requests carry their own details.
    if (!b.name?.trim() || !b.email?.trim() || (!b.message?.trim() && !b.productId))
      return res
        .status(400)
        .json({ message: "Name, email and message are required." });
    const clean = (v, n = 300) => String(v ?? "").trim().slice(0, n);
    const quantity = Math.max(1, Math.min(1000000, parseInt(b.quantity, 10) || 1));
    const selections = Array.isArray(b.selections)
      ? b.selections
          .slice(0, 30)
          .map((s) => ({ name: clean(s?.name, 100), value: clean(s?.value, 200) }))
          .filter((s) => s.name && s.value)
      : [];
    const q = await Quote.create({
      name: clean(b.name, 120),
      company: clean(b.company, 160),
      email: clean(b.email, 200),
      phone: clean(b.phone, 60),
      product: clean(b.product, 200),
      productId: /^[a-f0-9]{24}$/i.test(b.productId || "") ? b.productId : undefined,
      quantity,
      selections,
      message: clean(b.message, 5000),
    });
    res
      .status(201)
      .json({ message: "Your quote request has been submitted.", id: q._id });
  } catch (e) {
    next(e);
  }
});
r.get("/", requireAdmin, async (req, res, next) => {
  try {
    res.json(await Quote.find().sort({ createdAt: -1 }).limit(500));
  } catch (e) {
    next(e);
  }
});
r.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!["new", "contacted", "closed"].includes(req.body.status))
      return res.status(400).json({ message: "Invalid status." });
    const q = await Quote.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!q) return res.status(404).json({ message: "Quote not found." });
    res.json(q);
  } catch (e) {
    next(e);
  }
});
export default r;
