import { Listener, Subjects, OrderStatus } from "@shreekanthlakka/common";
import { queueGroupName } from "./queue-group-name.js";
import Order from "../../models/order.model.js";

class OrderCancelledListener extends Listener {
    subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const order = await Order.findOne({
            _id: data._id,
            version: data.version - 1,
        });
        if (!order) {
            throw new Error("Order not found");
        }
        order.set({
            status: OrderStatus.Cancelled,
        });
        await order.save();

        msg.ack();
    }
}

export { OrderCancelledListener };
