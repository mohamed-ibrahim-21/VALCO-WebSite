import mongoose from "mongoose";
const text = {
  en: { type: String, default: "", trim: true },
  ar: { type: String, default: "", trim: true },
};
const schema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: text,
    description: text,
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.models.Category || mongoose.model("Category", schema);
