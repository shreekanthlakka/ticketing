import mongoose from "mongoose";
import { OrderStatus } from "@shreekanthlakka/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
        expiresAt: {
            type: Date,
        },
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
        },
    },
    { timestamps: true }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model("Order", orderSchema);
export default Order;
