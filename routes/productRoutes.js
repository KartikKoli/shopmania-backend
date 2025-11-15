import express from "express";
import verifyUser from "../middlewares/authentication.js";
import authorizeRole from "../middlewares/authorization.js";
import upload from "../middlewares/multer.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/add",
  verifyUser,
  authorizeRole("admin"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  addProduct
);

router.get("/all", verifyUser, getAllProducts);

router.get("/:id", verifyUser, getProduct);

router.put(
  "/update/:id",
  verifyUser,
  authorizeRole("admin"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProduct
);

router.delete("/:id", verifyUser, authorizeRole("admin"), deleteProduct);

export default router;
