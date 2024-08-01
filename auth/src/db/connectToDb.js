import mongoose from "mongoose";

// const connectToDB = () => {
//     mongoose
//         .connect("mongodb://localhost:27017/users")
//         .then(() => {
//             console.log("connected to AUTH mongoDB !!! ");
//         })
//         .catch(() => console.log("error connecting mongodb"));
// };

const connectToDB = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("connected to AUTH mongoDB !!! ");
        })
        .catch(() => console.log("error connecting mongodb"));
};

export { connectToDB };
