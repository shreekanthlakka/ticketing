import { Listener, Subjects } from "@shreekanthlakka/common";
import { queueGroupName } from "./queue-group-name.js";
import Ticket from "../../models/ticket.model.js";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher.js";

class OrderCreatedListener extends Listener {
    subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        //find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticketId._id);
        //if no ticket throw  error
        if (!ticket) {
            throw new Error("ticket not found");
        }
        //mark the ticket as being reserved by setting the orderId property
        // ticket.set({ orderId: data._id });
        ticket.orderId = data._id;
        //save the ticket
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            _id: ticket._id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
        });

        //ack the message
        msg.ack();
    }
}

export { OrderCreatedListener };

/**
 * order published data when created
 * 
 *      _id: order._id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticketId: {
            _id: ticket._id,
            price: ticket.price,
        },
 * 
 */
