import { Listener } from "@shreekanthlakka/common";
import { Subjects } from "@shreekanthlakka/common";

class TicketUpdatedListener extends Listener {
    subject = Subjects.TicketUpdated;
    queueGroupName = "ticket-updated-queue-group";
    onMessage(data, msg) {
        console.log(
            `${this.subject} =>  ${msg.getSequence()} => ${msg.getData()}`,
            data
        );
        // Add logic here
        msg.ack();
    }
}

export { TicketUpdatedListener };
