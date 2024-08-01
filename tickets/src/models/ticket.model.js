import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        orderId: {
            type: String,
        },
    },
    { timestamps: true }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
