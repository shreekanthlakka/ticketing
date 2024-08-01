// import dotenv from "dotenv";
// dotenv.config();
import app from "./app.js";
import { connectToDB } from "./db/connectToDb.js";

app.listen(3000, () => {
    connectToDB();
    console.log(`Auth Server is running on port 3000!!!`);
});
