import { Subjects, Listener, CustomError } from "@shreekanthlakka/common";
import { queueGroupName } from "./queue-group-name.js";
import Ticket from "../../models/ticket.model.js";

class TicketUpdatedListener extends Listener {
    subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const ticket = await Ticket.findOne({
            _id: data._id,
            version: data.version - 1,
        });
        if (!ticket) {
            throw new Error("ticket not found");
        }
        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();
        msg.ack();
    }
}

export { TicketUpdatedListener };
