class Listener {
    constructor(client) {
        this.client = client;
        this.ackWait = 5 * 1000;
    }
    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait);
    }
    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );
        subscription.on("message", (msg) => {
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }
    parseMessage(msg) {
        const data = msg.getData();
        return typeof data === "string"
            ? JSON.parse(data)
            : JSON.parse(data.toString("utf8"));
    }
}

export { Listener };
