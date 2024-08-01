import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { CustomError } from "../utils/CustomError.js";
import User from "../models/user.model.js";
import { sendCookies } from "../utils/sendCookies.js";
import { CustomResponse } from "../utils/CustomResponse.js";

const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "validation errors ", errors.array()));
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new CustomError(404, "invalid credentials");
    }
    const isValidPassword = await user.isValidatePassword(password);
    if (!isValidPassword) {
        throw new CustomError(404, "invalid credentials");
    }
    if (isValidPassword) {
        sendCookies(user._id, res);
    }
});

const registerUser = asyncHandler(async (req, res) => {
    console.log("REQ.BODY =>", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "validation result", errors.array()));
    }
    const { email, password, username } = req.body;
    const user = await User.create({
        username,
        email,
        password,
    });
    if (!user) {
        throw new CustomError(400, "failed to create user");
    }
    res.status(201).json(
        new CustomResponse(201, "user created sucessfully", user)
    );
});

const logout = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
        throw new CustomError(404, "no user logged in");
    }
    user.accessToken = null;
    await user.save({ validateBeforeSave: false });
    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 0,
    };
    setTimeout(() => {
        res.status(200)
            .clearCookie("accessToken", options)
            .json(new CustomResponse(200, "user logged out sucessfully"));
    }, 0);
});

const loggedInUserDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new CustomError(400, "bad request");
    }
    res.status(200).json({
        isAuthenticated: true,
        success: true,
        data: user,
        message: "loggedIn user details",
    });
});

export { registerUser, loggedInUserDetails, login, logout };
