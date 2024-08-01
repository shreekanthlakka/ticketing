import { Subjects, Publisher } from "@shreekanthlakka/common";

class PaymentCreatedPublisher extends Publisher {
    subject = Subjects.PaymentCreated;
}

export { PaymentCreatedPublisher };
