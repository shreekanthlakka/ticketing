import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publish.js";
import { natsWrapper } from "../nats-wrapper.js";

const expirationQueue = new Queue("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST,
    },
});

expirationQueue.process(async (job) => {
    console.log("Expiration job processed <=====> ", job.data);
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
    });
});

export { expirationQueue };
