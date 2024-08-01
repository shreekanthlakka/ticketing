import { Publisher, Subjects } from "@shreekanthlakka/common";

class TicketCreatedPublisher extends Publisher {
    subject = Subjects.TicketCreated;
}

export { TicketCreatedPublisher };
