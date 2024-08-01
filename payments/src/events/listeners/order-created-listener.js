import { Listener, Subjects } from "@shreekanthlakka/common";
import { queueGroupName } from "./queue-group-name.js";
import Order from "../../models/order.model.js";

class OrderCreatedListener extends Listener {
    subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const order = await Order.create({
            _id: data._id,
            status: data.status,
            userId: data.userId,
            version: data.version,
            price: data.ticketId.price,
        });
        msg.ack();
    }
}

export { OrderCreatedListener };
