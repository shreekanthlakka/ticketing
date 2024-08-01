import nats from "node-nats-streaming";
class NatsWrapper {
    constructor() {
        this._client = null;
    }
    client() {
        if (!this._client) {
            throw new Error("Nats client not initialized in order service");
        }
        return this._client;
    }
    connect(clusterId, clientId, url) {
        this.client = nats.connect(clusterId, clientId, { url });
        return new Promise((resolve, reject) => {
            this.client
                .on("connect", () => {
                    console.log("Connected to NATS");
                    resolve();
                })
                .on("error", (err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }
}

export const natsWrapper = new NatsWrapper();
