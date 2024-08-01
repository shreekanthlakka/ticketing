import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { natsWrapper } from "./nats-wrapper.js";
import mongoose from "mongoose";
import { OrderCreatedListener } from "./events/listeners/order-created-listener.js";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener.js";

const start = async () => {
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
        console.log("==== Pid ===> ", process.pid);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Ticket Service ===> MongoDB Connected");
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed!!");
            process.exit();
        });

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());
    } catch (error) {
        console.log(" => ERROR => ", error);
    }

    app.listen(4000, () => {
        console.log("Payments Server is running on port 4000!!!");
    });
};

start();
