import { natsWrapper } from "../nats-wrapper.js";

const connectToNats = async () => {
    try {
        setTimeout(() => {
            natsWrapper
                .connect(
                    process.env.NATS_CLUSTER_ID,
                    process.env.NATS_CLIENT_ID,
                    process.env.NATS_URL
                )
                .then(() => {
                    console.log("Connected to NATS in order service");
                });
        }, 1000);
    } catch (error) {
        console.log("Error connecting to Nats", error);
    }
};

export { connectToNats };
