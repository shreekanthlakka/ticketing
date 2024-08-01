import { Listener } from "@shreekanthlakka/common/index.js";
import { Subjects } from "@shreekanthlakka/common";

class TicketCreatedListener extends Listener {
    subject = Subjects.TicketCreated;
    queueGroupName = "ticket-created-queue-group";
    onMessage(data, msg) {
        console.log(
            `${this.subject} =>  ${msg.getSequence()} => ${msg.getData()}`,
            data
        );
        // Add logic here
        msg.ack();
    }
}

export { TicketCreatedListener };
