import { Publisher, Subjects } from "@shreekanthlakka/common";

class ExpirationCompletePublisher extends Publisher {
    subject = Subjects.ExpirationComplete;
}

export { ExpirationCompletePublisher };
