import mongoose from "mongoose";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";

export const viewCart = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Not a valid cartId",
      });
    }
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(`Error in viewCart api: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
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
        message: "Product not found",
      });
    }
    const userId = req.user._id;
    const user = await User.findById(userId);
    const cart = await Cart.findById(user.cartId);
    const existingItem = cart.products.find((p) => p.item.toString() === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.products.push({ item: id, quantity: 1 });
    }
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.log(`Error in addToCart api: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const emptyCart = async (req, res) => {
  try {
    const user = req.user;
    const id = user.cartId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Not a valid cart id.",
      });
    }
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }
    cart.products = [];
    cart.amount = 0;
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Cart emptied successfully",
      cart
    });
  } catch (error) {
    console.log(`Error in emptyCart api: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
