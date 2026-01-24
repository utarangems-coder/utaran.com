import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ isActive: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ tags: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: "text", description: "text" });

export default mongoose.model("Product", productSchema);
