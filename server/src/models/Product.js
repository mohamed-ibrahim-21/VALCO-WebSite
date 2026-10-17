import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    sku: { type: String, default: "" },
    name: {
      en: { type: String, required: true },
      ar: { type: String, default: "" },
    },
    description: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    category: { type: String, default: "Valves" },
    categoryAr: { type: String, default: "" },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    options: { type: mongoose.Schema.Types.Mixed, default: {} },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.models.Product || mongoose.model("Product", schema);
