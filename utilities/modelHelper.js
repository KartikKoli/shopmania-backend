import Cart from "../models/Cart.js";

export const createCartForUser = async (user) => {
  try {
    if (!user.cartId) {
      const cart = await Cart.create({});
      user.cartId = cart._id;
      await user.save();
    }
  } catch (error) {
    console.error("Error creating cart for user:", error);
  }
};
