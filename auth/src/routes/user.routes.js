import express from "express";
import { body, checkSchema } from "express-validator";
import {
    loggedInUserDetails,
    login,
    logout,
    registerUser,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { userValidationSchema } from "../validations/userValidations.js";

const router = express.Router();

router
    .route("/login")
    .post(
        body("email")
            .notEmpty()
            .exists()
            .trim()
            .isEmail()
            .withMessage("provide valid email"),
        body("password")
            .exists()
            .notEmpty()
            .isLength({ min: 4, max: 8 })
            .withMessage("password should be in b/w 4 and 8"),
        login
    );
router.route("/register").post(checkSchema(userValidationSchema), registerUser);
router.route("/logout").post(isLoggedIn, logout);
router.route("/getLoggedInUser").get(isLoggedIn, loggedInUserDetails);

export default router;
