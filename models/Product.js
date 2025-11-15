import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: [
      {
        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot exceed 5"],
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  brand: {
    type: String,
    required: true,
  },
  logo: {
    type: String
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      "Electronics",
      "Clothing",
      "Footwear",
      "Accessories",
      "Home",
      "Beauty",
      "Books",
      "Furniture",
      "Toys",
      "Sports",
    ],
  },
  images: {
    type: [{ type: String }],
    default: [],
  },
});

export default mongoose.model("Product", productSchema);
