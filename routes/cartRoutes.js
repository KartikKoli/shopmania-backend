import express from "express";
import verifyUser from "../middlewares/authentication.js";
import { addToCart, viewCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/:id", verifyUser, viewCart);
router.put("/:id", verifyUser, addToCart);

export default router;
