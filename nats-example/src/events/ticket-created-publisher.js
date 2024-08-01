import { Publisher } from "../../../common/src/events/base-publisher.js";
import { Subjects } from "../../../common/src/events/subjects.js";

class TicketCreatedPublisher extends Publisher {
    subject = Subjects.TicketCreated;
}

export { TicketCreatedPublisher };
