import User from "../models/user.model.js";
import { CustomError } from "./CustomError.js";

const sendCookies = async (id, res) => {
    let user;
    try {
        user = await User.findById(id).select("+accessToken");
        if (!user) {
            throw new CustomError(400, "user not found");
        }
        const accessToken = await user.generateAccessToken();
        user.loggedInAt = [...user.loggedInAt, new Date().toISOString()];
        user.accessToken = accessToken;
        await user.save({ validateBeforeSave: false });
        const options = {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 1,
        };
        res.status(200).cookie("accessToken", accessToken, options).json({
            statusCode: 200,
            session: accessToken,
            data: user,
            success: true,
            message: "Logged In sucessfully",
        });
    } catch (error) {
        user.accessToken = null;
        await user.save({ validateBeforeSave: false });
        res.status(error.statusCode || 400).json(
            new CustomError(
                error.statusCode || 400,
                error.message || "something went wrong",
                error
            )
        );
    }
};

export { sendCookies };
