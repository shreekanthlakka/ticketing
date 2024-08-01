import express from "express";
import { isLoggedIn } from "@shreekanthlakka/common";
import { payment } from "../controllers/payments.controller.js";
import { body } from "express-validator";

const router = express.Router();

router
    .route("/")
    .post(
        isLoggedIn,
        body("token").notEmpty(),
        body("orderId").notEmpty(),
        payment
    );

export default router;
