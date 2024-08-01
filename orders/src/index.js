import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { natsWrapper } from "./nats-wrapper.js";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener.js";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener.js";
import mongoose from "mongoose";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listeners.js";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener.js";

const start = async () => {
    console.log("==== pid ====> ", process.pid);
    if (!process.env.MONGO_URI) {
        throw new Error("Mongo Uri not defined");
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS Cluster Id not defined");
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS Client Id not defined");
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS Url not defined");
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Orders Service ==> MongoDB Connected");
        // setTimeout(() => {
        //     (async () => {})();
        // }, 0);

        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed!");
            process.exit();
        });
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        // connectToNats();
    } catch (error) {
        console.log(" => ERROR => ", error);
    }

    app.listen(4000, () => {
        console.log("Order service is running on port 4000");
    });
};

start();
