import Ticket from "../models/ticket.model.js";
import {
    asyncHandler,
    CustomError,
    CustomResponse,
} from "@shreekanthlakka/common";
import { validationResult } from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher.js";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher.js";
import { natsWrapper } from "../nats-wrapper.js";
import { version } from "mongoose";

const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({});
    if (!tickets) {
        throw new CustomError(404, "no tickets found", tickets);
    }
    res.status(200).json(new CustomResponse(200, "all tickets", tickets));
});

const createTicket = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "bad request", errors.array()));
    }
    const { title, price } = req.body;
    const ticket = await Ticket.create({
        title,
        price,
        userId: req.user._id,
    });
    if (!ticket) {
        throw new CustomError(400, "failed to create ticket");
    }
    // await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
        _id: ticket._id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    });
    res.status(201).json(
        new CustomResponse(201, "ticket created successfully", ticket)
    );
});

const getSingleTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
        throw new CustomError(404, "ticket not found");
    }
    res.status(200).json(new CustomResponse(200, "ticket details", ticket));
});

const updateSingleTicket = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "bad request", errors.array()));
    }
    const { title, price } = req.body;
    const { ticketId } = req.params;
    const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        { title, price },
        { new: true }
    );
    if (!ticket) {
        throw new CustomError(404, "ticket not found");
    }
    if (ticket.orderId) {
        throw new CustomError(400, "cannot update a reserved ticket ");
    }
    if (ticket.userId.toString() !== req.user._id.toString()) {
        throw new CustomError(401, "unauthorized");
    }
    await ticket.save();
    //for updating the ticket version

    new TicketUpdatedPublisher(natsWrapper.client).publish({
        _id: ticket._id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    });
    res.status(200).json(new CustomResponse(200, "ticket updated", ticket));
});

export { createTicket, getAllTickets, getSingleTicket, updateSingleTicket };
