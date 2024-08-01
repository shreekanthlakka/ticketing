import dotenv from "dotenv";
dotenv.config();

import { natsWrapper } from "./nats-wrapper.js";
import { OrderCreatedListener } from "./events/listeners/order-created-listener.js";

const start = async () => {
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
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed!!!");
            process.exit();
        });

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());
        new OrderCreatedListener(natsWrapper.client).listen();
    } catch (error) {
        console.log(" => ERROR => ", error);
    }
};

start();
