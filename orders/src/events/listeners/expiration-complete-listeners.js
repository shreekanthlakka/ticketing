import { Listener, Subjects, OrderStatus } from "@shreekanthlakka/common";
import { queueGroupName } from "./queue-group-name.js";
import Order from "../../models/orders.model.js";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher.js";

class ExpirationCompleteListener extends Listener {
    subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const order = await Order.findById(data.orderId).populate("ticketId");
        if (!order) {
            throw new Error("Order not found");
        }
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }
        order.set({
            status: OrderStatus.Cancelled,
        });
        await order.save();

        console.log("Order status ==>", order);
        await new OrderCancelledPublisher(this.client).publish({
            _id: order._id,
            version: order.version,
            ticketId: {
                _id: order.ticketId._id,
            },
        });
        msg.ack();
    }
}

export { ExpirationCompleteListener };
