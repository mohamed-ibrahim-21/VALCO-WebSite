import jwt from "jsonwebtoken";
export function requireAdmin(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!token)
    return res.status(401).json({ message: "Authentication required." });
  try {
    const p = jwt.verify(token, process.env.JWT_SECRET);
    if (p.role !== "admin")
      return res.status(403).json({ message: "Admin access required." });
    req.admin = p;
    next();
  } catch {
    return res
      .status(401)
      .json({ message: "Session expired. Please sign in again." });
  }
}
