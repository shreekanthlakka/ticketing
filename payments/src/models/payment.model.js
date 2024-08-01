import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const paymentSchema = new mongoose.Schema(
    {
        orderId: String,
        stripeId: String,
    },
    { timestamps: true }
);

paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);
const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
