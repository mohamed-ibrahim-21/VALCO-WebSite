import { Router } from "express";
import Site from "../models/SiteContent.js";
import { requireAdmin } from "../middleware/auth.js";
const r = Router();
async function getSite() {
  return Site.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: { key: "main" } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}
r.get("/", async (req, res, next) => {
  try {
    res.json(await getSite());
  } catch (e) {
    next(e);
  }
});
r.put("/", requireAdmin, async (req, res, next) => {
  try {
    const allowed = [
        "companyName",
        "tagline",
        "heroTitle",
        "heroSubtitle",
        "heroImage",
        "aboutText",
        "contactEmail",
        "contactPhone",
        "contactLandline",
        "facebookUrl",
        "instagramUrl",
        "tiktokUrl",
        "xUrl",
        "linkedinUrl",
        "companyNameAr",
        "taglineAr",
        "heroTitleAr",
        "heroSubtitleAr",
        "aboutTextAr",
        "heroHighlight",
        "heroHighlightAr",
        "aboutImage",
      ],
      data = {};
    for (const k of allowed)
      if (req.body[k] !== undefined) data[k] = String(req.body[k] ?? "").slice(0, 2000);
    if (Array.isArray(req.body.stats))
      data.stats = req.body.stats.slice(0, 4).map((s) => ({
        value: String(s?.value ?? "").trim().slice(0, 20),
        label: {
          en: String(s?.label?.en ?? "").trim().slice(0, 60),
          ar: String(s?.label?.ar ?? "").trim().slice(0, 60),
        },
      }));
    res.json(
      await Site.findOneAndUpdate(
        { key: "main" },
        { $set: data, $setOnInsert: { key: "main" } },
        { new: true, upsert: true, runValidators: true },
      ),
    );
  } catch (e) {
    next(e);
  }
});
export default r;
