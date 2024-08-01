import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener.js";
import { TicketUpdatedListener } from "./events/ticket-updated-listener.js";

console.clear();
const stan = nats.connect(
    "ticketing",
    `${Math.floor(Math.random() * 999999) + 1}`,
    {
        url: "http://localhost:4222",
    }
);

stan.on("connect", () => {
    console.log("Listerner connected to NATS");
    stan.on("close", () => {
        console.log("NATS connection closed");
        process.exit();
    });
    new TicketCreatedListener(stan).listen();
    new TicketUpdatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

// class TicketCreatedListener extends Listener {
//     subject = "ticket:created";
//     queueGroupName = "ticket-created-queue-group";
//     onMessage(data, msg) {
//         console.log(
//             `TicketCreatedListener =>  ${msg.getSequence()} => ${msg.getData()}`,
//             data
//         );
//         // Add logic here
//         msg.ack();
//     }
// }

// abstract class Listener{
//     abstract subject: String
//     abstract queueGroupName: String
//     abstract onMessage(data: any, msg: any): void
//     private client: stan
//     protected ackWait: 5*1000
//     constructor(client: stan) {
//         this.client = client
//     }
//     subscriptionOptions() {
//        return  this.client.subscriptionOptions()
//         .setManualAckMode(true)
//         .setDeliverAllAvailable()
//         .setDurableName();
//     }
//     listen(){
//         const subscription = this.client.subscribe(
//             this.subject,
//             this.queueGroupName,
//             this.subscriptionOptions()
//         )
//         subscription.on("message", (msg) => {
//             console.log(`Received message ${msg.getSequence()} ${msg.getData()}`)
//             const parsedData = this.parseMessage(msg)
//             this.onMessage(parsedData, msg);
//         })
//     }
//     parseMessage(msg){
//         const data = msg.getData()
//         return typeof data === 'string' ? JSON.parse( data) : JSON.parse(data.toString('utf8'))
//     }
// }
