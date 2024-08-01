import {
    CustomError,
    asyncHandler,
    CustomResponse,
    OrderStatus,
} from "@shreekanthlakka/common";
import { validationResult } from "express-validator";
import Ticket from "../models/ticket.model.js";
import Order from "../models/orders.model.js";
import { natsWrapper } from "../nats-wrapper.js";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher.js";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher.js";
import { version } from "mongoose";

const createOrder = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "validation errors", errors.array()));
    }

    //find the ticket that the user is trying to order
    const ticket = await Ticket.findById(req.body.ticketId);
    if (!ticket) {
        throw new CustomError(404, "ticket not found");
    }

    //make sure that ticket is not reserved

    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new CustomError(400, "ticket is already reserved");
    }

    //calculate the expiration time for the order --- 15mins here
    const expitation = new Date();
    expitation.setSeconds(expitation.getSeconds() + 1 * 60);
    // create the order
    const order = await Order.create({
        userId: req.user._id,
        status: OrderStatus.Created,
        expiresAt: expitation,
        ticketId: ticket,
    });
    if (!order) {
        throw new CustomError(500, "Failed to create order");
    }
    // publish an event
    new OrderCreatedPublisher(natsWrapper.client).publish({
        _id: order._id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticketId: {
            _id: ticket._id,
            price: ticket.price,
        },
    });
    res.status(201).json(new CustomResponse(201, "order created", order));
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).populate(
        "ticketId"
    );
    if (!orders) {
        throw new CustomError(404, "no orders found!");
    }
    res.status(200).json(new CustomResponse(200, "orders fetched", orders));
});
const getSingleOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("ticketId");
    if (!order) {
        throw new CustomError(404, "order not found");
    }
    if (order.userId !== req.user._id) {
        throw new CustomError(
            403,
            "you are not authorized to access this order"
        );
    }
    res.status(200).json(new CustomResponse(200, "order fetched", order));
});
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId).populate("ticketId");
    if (!order) {
        throw new CustomError(404, "order not found");
    }
    if (order.userId !== req.user._id) {
        throw new CustomError(
            403,
            "you are not authorized to delete this order"
        );
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    // publish an event
    new OrderCancelledPublisher(natsWrapper.client).publish({
        _id: order._id,
        version: order.version,
        ticket: {
            _id: order.ticketId,
        },
    });
    res.status(204).json(new CustomResponse(204, "order deleted", order));
});

export { createOrder, getAllOrders, getSingleOrder, deleteOrder };
