import { Subjects, Listener } from "@shreekanthlakka/common";
import { queueGroupName } from "./queue-group-name.js";
import Ticket from "../../models/ticket.model.js";

class TicketCreatedListener extends Listener {
    subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    async onMessage(data, msg) {
        const { _id, title, price, version } = data;
        const ticket = await Ticket.create({
            _id,
            title,
            price,
            version,
        });
        msg.ack();
    }
}

export { TicketCreatedListener };
