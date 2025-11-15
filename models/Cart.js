import mongoose from "mongoose";

const cartSchema= new mongoose.Schema({
    "products": [
        {
            item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
            quantity: {
            type: Number,
            default: 1,
        },
    }
    ],
    "amount":{
        type: Number,
        default: 0
    }
});

export default mongoose.model("Cart",cartSchema);