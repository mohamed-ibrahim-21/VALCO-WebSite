import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    product: { type: String, default: "" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);
export default mongoose.models.Quote || mongoose.model("Quote", schema);
