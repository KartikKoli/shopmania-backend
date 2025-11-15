import express from "express";
import verifyUser from "../middlewares/authentication.js";
import {
  addToCart,
  emptyCart,
  viewCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", verifyUser, viewCart);
router.put("/", verifyUser, addToCart);
router.put("/empty", verifyUser, emptyCart);

export default router;
