import mongoose from "mongoose";
import express from "express";
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getSingleOrder,
} from "../controllers/orders.controller.js";
import { isLoggedIn } from "@shreekanthlakka/common";
import { body } from "express-validator";
const router = express.Router();

router
    .route("/")
    .get(isLoggedIn, getAllOrders)
    .post(
        isLoggedIn,
        body("ticketId")
            .notEmpty()
            .custom((input) => mongoose.Types.ObjectId.isValid(input)),
        createOrder
    );
router
    .route("/:orderId")
    .get(isLoggedIn, getSingleOrder)
    .delete(isLoggedIn, deleteOrder);

export default router;
