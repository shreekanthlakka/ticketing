import {
    asyncHandler,
    CustomResponse,
    CustomError,
    OrderStatus,
} from "@shreekanthlakka/common";
import { validationResult } from "express-validator";
import Order from "../models/order.model.js";
import { stripe } from "../stripe.js";
import Payment from "../models/payment.model.js";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher.js";
import { natsWrapper } from "../nats-wrapper.js";

const payment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "validation errors", errors.array()));
    }
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
        throw new CustomError(400, "order not found");
    }
    if (order.userId !== req.user._id) {
        throw new CustomError(400, "not authorozed ");
    }
    if (order.status === OrderStatus.Cancelled) {
        throw new CustomError(400, "order is cancelled");
    }
    const charge = await stripe.charges.create({
        amount: order.price * 100,
        currency: "usd",
        source: token,
    });

    const payment = await Payment.create({
        orderId,
        stripeId: charge._id,
    });

    new PaymentCreatedPublisher(natsWrapper.client).publish({
        _id: payment._id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
    });

    res.status(200).json({ success: true, _id: payment._id });
});

export { payment };
