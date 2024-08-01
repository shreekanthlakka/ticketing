import { Publisher, Subjects } from "@shreekanthlakka/common";

class OrderCancelledPublisher extends Publisher {
    subject = Subjects.OrderCancelled;
}

export { OrderCancelledPublisher };
