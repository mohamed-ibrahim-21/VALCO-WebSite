// Startup data: default categories (5 main ones, with the 6 valve types under Valves),
// linking existing products to them, and replacing untouched default homepage copy.
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import SiteContent from "./models/SiteContent.js";

export const MAIN_CATEGORIES = [
  {
    slug: "valves",
    name: { en: "Valves", ar: "المحابس" },
    description: {
      en: "Gate, ball, globe, butterfly, check and safety valves for every application.",
      ar: "محابس بوابة وكروية وجلوب وفراشة وعدم رجوع وصمامات أمان لكل الاستخدامات.",
    },
  },
  {
    slug: "pipes",
    name: { en: "Pipes", ar: "المواسير" },
    description: {
      en: "Carbon steel, stainless steel and alloy pipes in standard sizes and schedules.",
      ar: "مواسير صلب كربوني واستانلس وسبائك بالمقاسات والسماكات القياسية.",
    },
  },
  {
    slug: "fittings",
    name: { en: "Fittings", ar: "الوصلات" },
    description: {
      en: "Elbows, tees, reducers and caps for butt-weld, socket-weld and threaded lines.",
      ar: "أكواع وتيهات ومسلوبات وطبات لخطوط اللحام والقلاووظ.",
    },
  },
  {
    slug: "flanges",
    name: { en: "Flanges", ar: "الفلانشات" },
    description: {
      en: "Weld neck, slip-on, blind and socket-weld flanges to international standards.",
      ar: "فلانشات برقبة وسليب أون وعمياء ولحام بالمقاييس العالمية.",
    },
  },
  {
    slug: "services",
    name: { en: "Services", ar: "الخدمات" },
    description: {
      en: "Valve maintenance, repair and pressure testing.",
      ar: "صيانة وإصلاح واختبار ضغط المحابس.",
    },
  },
];

// Valve types, shown under Valves.
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

const OLD_SITE_TEXT = {
  heroTitle: ["Reliable valve solutions for industry", "Reliable Valves for a"],
  heroTitleAr: ["حلول محابس موثوقة للصناعة", "محابس موثوقة"],
  heroSubtitle: [
    "Precision, safety and dependable flow control solutions.",
    "High-quality industrial valves, fittings, flanges and piping materials, backed by expert maintenance and testing to keep your projects running safely.",
  ],
  heroSubtitleAr: [
    "دقة وأمان وحلول تحكم في التدفق يمكن الاعتماد عليها.",
    "محابس صناعية ووصلات وفلانشات ومواسير عالية الجودة، مدعومة بخدمات صيانة واختبار متخصصة للحفاظ على سلامة مشروعاتك.",
  ],
  aboutText: [
    "We support industrial customers with dependable valve solutions.",
    "VALCO provides high-quality industrial valves, piping materials and related solutions with a focus on reliability, technical expertise and long-term partnerships. We work with trusted manufacturers to deliver the right products for your projects.",
  ],
  aboutTextAr: [
    "ندعم عملاءنا في القطاع الصناعي بحلول محابس يمكن الاعتماد عليها.",
    "تقدم VALCO محابس صناعية ومواسير وحلولًا متكاملة عالية الجودة، مع التركيز على الاعتمادية والخبرة الفنية والشراكات طويلة المدى. نتعامل مع مصنعين موثوقين لتوفير المنتجات المناسبة لمشروعاتك.",
  ],
};
// The red ending only belonged to the old headline.
const OLD_HIGHLIGHT = { heroHighlight: "Safer Tomorrow", heroHighlightAr: "لغدٍ أكثر أمانًا" };

const CATALOG_VERSION = 2;

export async function ensureDefaults() {
  const site = await SiteContent.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: { key: "main" } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  // Catalog structure v2: 5 main categories, the 6 valve types become sub-categories of Valves.
  if ((site.catalogVersion || 0) < CATALOG_VERSION) {
    const existing = new Set((await Category.find({}, "slug")).map((c) => c.slug));
    const toAdd = [
      ...MAIN_CATEGORIES.map((c, i) => ({ ...c, order: i + 1, parent: "" })),
      ...DEFAULT_CATEGORIES.map((c, i) => ({ ...c, order: i + 1, parent: "valves" })),
    ].filter((c) => !existing.has(c.slug));
    if (toAdd.length) await Category.insertMany(toAdd);
    await Category.updateMany(
      { slug: { $in: DEFAULT_CATEGORIES.map((c) => c.slug) } },
      { $set: { parent: "valves" } },
    );
    await Category.updateMany(
      { slug: { $in: MAIN_CATEGORIES.map((c) => c.slug) } },
      { $set: { parent: "" } },
    );
    site.catalogVersion = CATALOG_VERSION;
    await site.save();
    console.log(`Catalog updated: ${toAdd.length} categor${toAdd.length === 1 ? "y" : "ies"} added; valve types now under Valves`);
  }

  // Link products created before categories existed, by matching their category name.
  const categories = await Category.find();
  const unlinked = await Product.find({
    $or: [{ categorySlug: { $exists: false } }, { categorySlug: "" }],
  });
  let linked = 0;
  for (const p of unlinked) {
    const label = String(p.category || "").trim().toLowerCase();
    if (!label && !p.categoryAr) continue;
    const c = categories.find(
      (c) => c.name.en.toLowerCase() === label || (p.categoryAr && c.name.ar === p.categoryAr),
    );
    if (!c) continue;
    p.categorySlug = c.slug;
    p.category = c.name.en;
    p.categoryAr = c.name.ar;
    await p.save();
    linked++;
  }
  if (linked) console.log(`Linked ${linked} existing product(s) to categories`);

  // Only replace homepage text that is still an old untouched default.
  let changed = false;
  for (const [field, olds] of Object.entries(OLD_SITE_TEXT)) {
    if (olds.includes(site[field])) {
      site[field] = SiteContent.schema.path(field).defaultValue;
      changed = true;
    }
  }
  for (const [field, old] of Object.entries(OLD_HIGHLIGHT)) {
    if (site[field] === old) {
      site[field] = "";
      changed = true;
    }
  }
  if (changed) {
    await site.save();
    console.log("Updated default homepage text to the new design");
  }
}
