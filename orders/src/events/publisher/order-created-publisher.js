import { Publisher, Subjects } from "@shreekanthlakka/common";

class OrderCreatedPublisher extends Publisher {
    subject = Subjects.OrderCreated;
}

export { OrderCreatedPublisher };
