import mongoose from "mongoose";
const text = {
  en: { type: String, default: "", trim: true },
  ar: { type: String, default: "", trim: true },
};
// A downloadable file (catalog, datasheet, certificate). The file itself is stored in
// MongoDB GridFS ("downloads" bucket) so it survives server restarts.
const schema = new mongoose.Schema(
  {
    title: text,
    description: text,
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    filename: { type: String, required: true },
    contentType: { type: String, default: "application/octet-stream" },
    size: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.models.Download || mongoose.model("Download", schema);
