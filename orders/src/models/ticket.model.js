import mongoose from "mongoose";
import Order from "./orders.model.js";
import { OrderStatus } from "@shreekanthlakka/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// ticketSchema.pre("save", function (next) {
//     this.$where = {
//         version: this.get("version") - 1,
//     };
//     next();
// });

// ticketSchema.statics.findByEvent = (event) => {
//     return Ticket.findOne({
//         _id: event.id,
//         version: event.version,
//     });
// };

ticketSchema.methods.isReserved = async function () {
    //run a query to look at all orders , find an order where the ticket Id and the order status not cancelled
    //if we found the order that means ticket is reserved
    const existingOrder = await Order.findOne({
        ticketId: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ],
        },
    });
    return !!existingOrder;
};

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
