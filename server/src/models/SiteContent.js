import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "main" },
    companyName: { type: String, default: "VALCO" },
    tagline: { type: String, default: "VALVE MAINTENANCE & TESTING" },
    heroTitle: {
      type: String,
      default: "Reliable valve solutions for industry",
    },
    heroSubtitle: {
      type: String,
      default: "Precision, safety and dependable flow control solutions.",
    },
    heroImage: { type: String, default: "" },
    aboutText: {
      type: String,
      default:
        "We support industrial customers with dependable valve solutions.",
    },
    companyNameAr: { type: String, default: "" },
    taglineAr: { type: String, default: "صيانة واختبار المحابس" },
    heroTitleAr: { type: String, default: "حلول محابس موثوقة للصناعة" },
    heroSubtitleAr: {
      type: String,
      default: "دقة وأمان وحلول تحكم في التدفق يمكن الاعتماد عليها.",
    },
    aboutTextAr: {
      type: String,
      default:
        "ندعم عملاءنا في القطاع الصناعي بحلول محابس يمكن الاعتماد عليها.",
    },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
  },
  { timestamps: true },
);
export default mongoose.models.SiteContent ||
  mongoose.model("SiteContent", schema);
