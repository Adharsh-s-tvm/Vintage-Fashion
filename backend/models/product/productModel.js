import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ], // Array of Variant IDs
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
