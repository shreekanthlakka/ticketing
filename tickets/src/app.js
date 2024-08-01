import express from "express";
import fs from "fs";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const writeStream = fs.createWriteStream(path.join(__dirname, "./access.log"), {
    flags: "a",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny", { stream: writeStream }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(
        `${req.protocol} ==> ${req.ip} ==> ${req.method} ==> ${
            req.url
        } ==> ${new Date()}`
    );
    next();
});

import ticketRoutes from "./routes/ticket.routes.js";

app.use("/api/v1/tickets", ticketRoutes);

export default app;
