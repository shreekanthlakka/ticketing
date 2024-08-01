import { Publisher, Subjects } from "@shreekanthlakka/common";

class TicketUpdatedPublisher extends Publisher {
    subject = Subjects.TicketUpdated;
}

export { TicketUpdatedPublisher };
