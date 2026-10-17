import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    product: { type: String, default: "" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, min: 1, default: 1 },
    selections: {
      type: [
        new mongoose.Schema(
          { name: { type: String, default: "" }, value: { type: String, default: "" } },
          { _id: false },
        ),
      ],
      default: [],
    },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);
export default mongoose.models.Quote || mongoose.model("Quote", schema);
