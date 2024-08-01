import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log("--dir", __dirname);

const app = express();
const morganStream = fs.createWriteStream(
    path.join(__dirname, "./access.log"),
    { flags: "a" }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny", { stream: morganStream }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.ip} ==> ${req.method} ==> ${req.url} ==> ${new Date()}`);
    next();
});

// app.get("/api/v1/users/test", (req, res) => {
//     res.status(200).json({ message: "Hello World!" });
// });
import userRoutes from "../src/routes/user.routes.js";
app.use("/api/v1/users", userRoutes);

export default app;
