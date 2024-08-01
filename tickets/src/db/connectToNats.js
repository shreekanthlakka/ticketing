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
                .then(() => console.log("connected to nats"));
        }, 1000);
    } catch (error) {
        console.error("Error connecting to NATS", error);
    }
};

export { connectToNats };
