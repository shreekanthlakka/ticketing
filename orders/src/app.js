import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import orderRoutes from "./routes/orders.routes.js";

const dirName = dirname(fileURLToPath(import.meta.url));
const writeStream = fs.createWriteStream(path.join(dirName, "access.log"), {
    flags: "a",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined", { stream: writeStream }));
app.use((req, res, next) => {
    console.log(
        `${req.protocol} ==> ${req.ip} ==> ${req.method} ==> ${
            req.url
        } ==> ${new Date()} `
    );
    next();
});

app.use("/api/v1/orders", orderRoutes);

export default app;
