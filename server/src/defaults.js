// Startup data: the six default product categories, linking existing products to them,
// and replacing the old default homepage copy with the new design's copy.
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import SiteContent from "./models/SiteContent.js";

export const DEFAULT_CATEGORIES = [
  {
    slug: "gate-valves",
    name: { en: "Gate Valves", ar: "محابس بوابة" },
    description: {
      en: "Full-bore isolation for water, oil, gas and steam lines.",
      ar: "عزل كامل لخطوط المياه والبترول والغاز والبخار.",
    },
  },
  {
    slug: "ball-valves",
    name: { en: "Ball Valves", ar: "محابس كروية" },
    description: {
      en: "Quick quarter-turn shut-off with tight sealing.",
      ar: "غلق سريع بربع لفة مع إحكام عالٍ.",
    },
  },
  {
    slug: "globe-valves",
    name: { en: "Globe Valves", ar: "محابس جلوب" },
    description: {
      en: "Accurate flow regulation and throttling.",
      ar: "تنظيم دقيق للتدفق والتحكم فيه.",
    },
  },
  {
    slug: "butterfly-valves",
    name: { en: "Butterfly Valves", ar: "محابس فراشة" },
    description: {
      en: "Compact, lightweight control for large diameters.",
      ar: "تحكم مدمج وخفيف للأقطار الكبيرة.",
    },
  },
  {
    slug: "check-valves",
    name: { en: "Check Valves", ar: "محابس عدم رجوع" },
    description: {
      en: "Automatic backflow prevention for pumps and lines.",
      ar: "منع تلقائي للتدفق العكسي في الطلمبات والخطوط.",
    },
  },
  {
    slug: "safety-valves",
    name: { en: "Safety Valves", ar: "صمامات أمان" },
    description: {
      en: "Overpressure protection for boilers and vessels.",
      ar: "حماية من الضغط الزائد للغلايات والأوعية.",
    },
  },
];

const OLD_TO_NEW_SITE_TEXT = {
  heroTitle: ["Reliable valve solutions for industry", "Reliable Valves for a"],
  heroTitleAr: ["حلول محابس موثوقة للصناعة", "محابس موثوقة"],
  heroSubtitle: [
    "Precision, safety and dependable flow control solutions.",
    SiteContent.schema.path("heroSubtitle").defaultValue,
  ],
  heroSubtitleAr: [
    "دقة وأمان وحلول تحكم في التدفق يمكن الاعتماد عليها.",
    SiteContent.schema.path("heroSubtitleAr").defaultValue,
  ],
  aboutText: [
    "We support industrial customers with dependable valve solutions.",
    SiteContent.schema.path("aboutText").defaultValue,
  ],
  aboutTextAr: [
    "ندعم عملاءنا في القطاع الصناعي بحلول محابس يمكن الاعتماد عليها.",
    SiteContent.schema.path("aboutTextAr").defaultValue,
  ],
};

export async function ensureDefaults() {
  if ((await Category.countDocuments()) === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES.map((c, i) => ({ ...c, order: i + 1 })));
    console.log("Created the 6 default product categories");
  }

  // Link products created before categories existed, by matching their category name.
  const categories = await Category.find();
  const unlinked = await Product.find({
    $or: [{ categorySlug: { $exists: false } }, { categorySlug: "" }],
  });
  let linked = 0;
  for (const p of unlinked) {
    const label = String(p.category || "").trim().toLowerCase();
    const c = categories.find(
      (c) => c.name.en.toLowerCase() === label || c.name.ar === p.categoryAr,
    );
    if (!c) continue;
    p.categorySlug = c.slug;
    p.category = c.name.en;
    p.categoryAr = c.name.ar;
    await p.save();
    linked++;
  }
  if (linked) console.log(`Linked ${linked} existing product(s) to categories`);

  // Only replace homepage text that is still the old untouched default.
  const site = await SiteContent.findOne({ key: "main" });
  if (site) {
    let changed = false;
    for (const [field, [oldText, newText]] of Object.entries(OLD_TO_NEW_SITE_TEXT)) {
      if (site[field] === oldText) {
        site[field] = newText;
        changed = true;
      }
    }
    if (changed) {
      await site.save();
      console.log("Updated default homepage text to the new design");
    }
  }
}
