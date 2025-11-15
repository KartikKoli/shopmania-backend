import express from "express";
import dotenv from "dotenv";
import connectToDb from "./db/connectDb.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.listen(PORT, () => {
  console.log(`Server listening on PORT:${PORT}`);
});

app.use("/shopmania/v1/user", userRouter);
app.use("/shopmania/v1/product", productRouter);
app.use("/shopmania/v1/cart", cartRouter);

await connectToDb(MONGO_URI);
