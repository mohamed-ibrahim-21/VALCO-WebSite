import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { requireAdmin } from "../middleware/auth.js";
const r = Router();
r.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "")
        .trim()
        .toLowerCase(),
      password = String(req.body.password || "");
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    const admin = await Admin.findOne({ email }).select("+passwordHash");
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash)))
      return res.status(401).json({ message: "Invalid email or password." });
    const token = jwt.sign(
      { sub: String(admin._id), email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );
    res.json({ token, admin: { email: admin.email } });
  } catch (e) {
    next(e);
  }
});
r.post("/change-password", requireAdmin, async (req, res, next) => {
  try {
    const current = String(req.body.currentPassword || ""),
      next_ = String(req.body.newPassword || "");
    if (!current || !next_)
      return res.status(400).json({ message: "Current and new password are required." });
    if (next_.length < 8)
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    if (next_ === current)
      return res.status(400).json({ message: "New password must be different from the current one." });
    const admin = await Admin.findById(req.admin.sub).select("+passwordHash");
    if (!admin) return res.status(404).json({ message: "Admin account not found." });
    if (!(await bcrypt.compare(current, admin.passwordHash)))
      return res.status(400).json({ message: "Current password is incorrect." });
    admin.passwordHash = await bcrypt.hash(next_, 12);
    await admin.save();
    res.json({ message: "Password changed." });
  } catch (e) {
    next(e);
  }
});
r.get("/me", requireAdmin, (req, res) =>
  res.json({ admin: { email: req.admin.email } }),
);
export default r;
