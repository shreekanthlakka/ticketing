import { CustomError } from "../utils/CustomError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const isLoggedIn = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new CustomError(401, "not authorized or signedIn into App");
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
        throw new CustomError(401, "Invalid Token");
    }
    req.user = {
        _id: decode._id,
        email: decode.email,
    };
    next();
});

export { isLoggedIn };
