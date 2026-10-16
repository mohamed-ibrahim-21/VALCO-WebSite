import { Router } from "express";
import Quote from "../models/Quote.js";
import { requireAdmin } from "../middleware/auth.js";
const r = Router();
r.post("/", async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.name?.trim() || !b.email?.trim() || !b.message?.trim())
      return res
        .status(400)
        .json({ message: "Name, email and message are required." });
    const q = await Quote.create(b);
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
