import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "main" },
    companyName: { type: String, default: "VALCO" },
    tagline: { type: String, default: "VALVE MAINTENANCE & TESTING" },
    // The hero headline is shown as heroTitle followed by heroHighlight in red.
    heroTitle: { type: String, default: "Reliable Valves for a" },
    heroHighlight: { type: String, default: "Safer Tomorrow" },
    heroSubtitle: {
      type: String,
      default:
        "High-quality industrial valves, fittings, flanges and piping materials, backed by expert maintenance and testing to keep your projects running safely.",
    },
    heroImage: { type: String, default: "" },
    aboutText: {
      type: String,
      default:
        "VALCO provides high-quality industrial valves, piping materials and related solutions with a focus on reliability, technical expertise and long-term partnerships. We work with trusted manufacturers to deliver the right products for your projects.",
    },
    aboutImage: { type: String, default: "" },
    companyNameAr: { type: String, default: "" },
    taglineAr: { type: String, default: "صيانة واختبار المحابس" },
    heroTitleAr: { type: String, default: "محابس موثوقة" },
    heroHighlightAr: { type: String, default: "لغدٍ أكثر أمانًا" },
    heroSubtitleAr: {
      type: String,
      default:
        "محابس صناعية ووصلات وفلانشات ومواسير عالية الجودة، مدعومة بخدمات صيانة واختبار متخصصة للحفاظ على سلامة مشروعاتك.",
    },
    aboutTextAr: {
      type: String,
      default:
        "تقدم VALCO محابس صناعية ومواسير وحلولًا متكاملة عالية الجودة، مع التركيز على الاعتمادية والخبرة الفنية والشراكات طويلة المدى. نتعامل مع مصنعين موثوقين لتوفير المنتجات المناسبة لمشروعاتك.",
    },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" }, // mobile
    contactLandline: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    tiktokUrl: { type: String, default: "" },
    xUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
  },
  { timestamps: true },
);
export default mongoose.models.SiteContent ||
  mongoose.model("SiteContent", schema);
