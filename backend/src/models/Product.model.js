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
      index: true,
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

export default mongoose.model("Product", productSchema);
