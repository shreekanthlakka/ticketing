import { Listener, Subjects } from "@shreekanthlakka/common";
import { queueGroupName } from "./queue-group-name.js";
import Ticket from "../../models/ticket.model.js";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher.js";

class OrderCancelledListener extends Listener {
    subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        console.log("data in order cancelled listener ===>", data);
        const ticket = await Ticket.findById(data.ticketId._id);
        if (!ticket) {
            throw new Error("Ticket not found");
        }
        ticket.set({ orderId: undefined });
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            _id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
        });

        msg.ack();
    }
}
export { OrderCancelledListener };
