import mongoose from "mongoose";
import Product from "../models/Product.js";
import {extractPublicId} from "../utilities/publicIdExtractor.js"
import cloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const { title, description, price, stock, brand, logo, category } =
      req.body;
    const allowedCategories = [
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
    ];
    if (!title || !description || !price || !brand || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete details for the product",
      });
    }
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Not a valid category.",
      });
    }
    const files = req.files || {};
    let logoUrl = "";
    if (files.logo && files.logo.length > 0) {
      logoUrl = files.logo[0].path;
    }
    const imageUrls = files ? files.images.map((file) => file.path) : [];
    const productDetails = {
      title,
      description,
      price: Number(price),
      stock: stock || 0,
      brand,
      logo: logoUrl || "",
      category,
      images: imageUrls,
    };
    const product = await Product.create(productDetails);
    res.status(200).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log(`Error in addProduct api: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(`Error in getProduct api: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "page and limit should be positive integer value",
      });
    }
    const skip = (page - 1) * limit;
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalProducts = await Product.countDocuments();
    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: page,
      products,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.log(`Error in getAllProducts api: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, description, price, stock, brand, category } = req.body;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Not a valid product id",
      });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    const allowedCategories = [
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
    ];
    const updatedProduct = {};
    if (title) updatedProduct.title = title;
    if (description) updatedProduct.description = description;
    if (price) updatedProduct.price = parseInt(price);
    if (stock) updatedProduct.stock = parseInt(stock);
    if (brand) updatedProduct.brand = brand;
    if (category) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Not a valid category",
        });
      }
      updatedProduct.category = category;
    }
    const files = req.files || {};
    if (files.logo && files.logo.length > 0) {
      updatedProduct.logo = files.logo[0].path;
    }
    if (files.images && files.images.length > 0) {
      updatedProduct.images = files.images.map((file) => file.path);
    }
    const finalProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updatedProduct },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: finalProduct,
    });
  } catch (error) {
    console.log(`Error in updateProduct api: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Not a valid product id",
      });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    if (product.logo) {
      try {
        await cloudinary.uploader.destroy(extractPublicId(product.logo));
      } catch (error) {
        console.warn(`Could not delete logo: ${error.message}`);
      }
    }
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        try {
          await cloudinary.uploader.destroy(extractPublicId(img));
        } catch (error) {
          console.warn(`Could not delete image: ${error.message}`);
        }
      }
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.log(`Error in deleteProduct api: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
