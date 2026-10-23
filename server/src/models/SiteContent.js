import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "main" },
    companyName: { type: String, default: "VALCO" },
    tagline: { type: String, default: "VALVE MAINTENANCE & TESTING" },
    // The hero headline is shown as heroTitle followed by heroHighlight in red.
    // Words between *asterisks* are shown in red. heroHighlight is an optional red ending.
    heroTitle: { type: String, default: "VALVES. *PIPES.* *FITTINGS.* SERVICES." },
    heroHighlight: { type: String, default: "" },
    heroSubtitle: {
      type: String,
      default:
        "Your trusted partner for high-quality industrial valves, pipes, fittings and services across oil & gas, power, water and industrial sectors.",
    },
    heroImage: { type: String, default: "" },
    aboutText: {
      type: String,
      default:
        "VALCO is a trusted supplier and service provider of valves, pipes, fittings and related industrial solutions, serving multiple industries with a focus on quality, reliability and customer satisfaction.",
    },
    aboutImage: { type: String, default: "" },
    companyNameAr: { type: String, default: "" },
    taglineAr: { type: String, default: "صيانة واختبار المحابس" },
    heroTitleAr: { type: String, default: "محابس. *مواسير.* *وصلات.* خدمات." },
    heroHighlightAr: { type: String, default: "" },
    heroSubtitleAr: {
      type: String,
      default:
        "شريكك الموثوق في المحابس والمواسير والوصلات والخدمات الصناعية عالية الجودة لقطاعات البترول والغاز والطاقة والمياه والصناعة.",
    },
    aboutTextAr: {
      type: String,
      default:
        "VALCO مورد ومقدم خدمات موثوق للمحابس والمواسير والوصلات والحلول الصناعية، نخدم قطاعات متعددة مع التركيز على الجودة والاعتمادية ورضا العملاء.",
    },
    // Four "numbers" cards in the About section; a card with an empty value is hidden.
    stats: {
      type: [
        new mongoose.Schema(
          {
            value: { type: String, default: "" },
            label: { en: { type: String, default: "" }, ar: { type: String, default: "" } },
          },
          { _id: false },
        ),
      ],
      default: () => [
        { value: "", label: { en: "Products", ar: "منتج" } },
        { value: "", label: { en: "Happy Clients", ar: "عميل راضٍ" } },
        { value: "", label: { en: "Industries Served", ar: "قطاع نخدمه" } },
        { value: "", label: { en: "Support", ar: "دعم فني" } },
      ],
    },
    catalogVersion: { type: Number, default: 0 },
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
