import mongoose from "mongoose";
const text = { en: { type: String, default: "" }, ar: { type: String, default: "" } };
const optionGroup = new mongoose.Schema(
  {
    name: text,
    required: { type: Boolean, default: true },
    values: { type: [text], default: [] },
  },
  { _id: false },
);
const spec = new mongoose.Schema({ label: text, value: text }, { _id: false });
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
    // Choices the customer picks on the product page (e.g. Size: DN50 / DN100)
    optionGroups: { type: [optionGroup], default: [] },
    // Fixed technical details shown as a table (e.g. Material: Cast steel)
    specs: { type: [spec], default: [] },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.models.Product || mongoose.model("Product", schema);
