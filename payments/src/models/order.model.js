import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@shreekanthlakka/common";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
        },
    },
    { timestamps: true }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model("Order", orderSchema);

export default Order;
