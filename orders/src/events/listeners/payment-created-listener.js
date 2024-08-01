import { Listener, Subjects, OrderStatus } from "@shreekanthlakka/common";
import { queueGroupName } from "./queue-group-name.js";
import Order from "../../models/orders.model.js";

class PaymentCreatedListener extends Listener {
    subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        order.set({
            status: OrderStatus.Complete,
        });
        await order.save();
        msg.ack();
    }
}

export { PaymentCreatedListener };
