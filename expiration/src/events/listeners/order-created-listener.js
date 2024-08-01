import { Listener, Subjects } from "@shreekanthlakka/common";
import { queueGroupName } from "./queue-group-name.js";
import { expirationQueue } from "../../queues/expiration-queue.js";
class OrderCreatedListener extends Listener {
    subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add(
            {
                orderId: data._id,
            },
            {
                delay,
            }
        );
        msg.ack();
    }
}

export { OrderCreatedListener };
