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
      if (req.body[k] !== undefined) data[k] = req.body[k];
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
