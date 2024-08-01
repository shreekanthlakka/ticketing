import express from "express";
import { body, checkSchema } from "express-validator";
import { isLoggedIn } from "@shreekanthlakka/common";
import {
    createTicket,
    getAllTickets,
    getSingleTicket,
    updateSingleTicket,
} from "../controllers/ticket.controller.js";
import { ticketValidationSchema } from "../validation/ticket.validation.js";

const router = express.Router();

router
    .route("/")
    .post(isLoggedIn, checkSchema(ticketValidationSchema), createTicket)
    .get(getAllTickets);

router
    .route("/:ticketId")
    .get(getSingleTicket)
    .put(
        isLoggedIn,
        body("title").exists().notEmpty(),
        body("price").exists().notEmpty(),
        updateSingleTicket
    );

export default router;
