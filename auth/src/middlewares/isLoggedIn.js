import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/CustomError.js";

const isLoggedIn = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new CustomError(401, "not authorized or signed In");
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode._id).select("-password");
    if (!user) {
        throw new CustomError(401, "not authorized or signed In");
    }
    req.user = {
        _id: user._id,
        email: user.email,
    };
    next();
});

export { isLoggedIn };
