import User from "../models/user.model.js";

const userValidationSchema = {
    username: {
        in: ["body"],
        exists: {
            errorMessage: "username should exists",
        },
        notEmpty: {
            errorMessage: "username should bot be empty",
        },
        trim: true,
    },
    email: {
        in: ["body"],
        exists: {
            errorMessage: "email should exists",
        },
        notEmpty: {
            errorMessage: "email should bot be empty",
        },
        trim: true,
        isEmail: {
            errorMessage: "not valid email",
        },
        custom: {
            options: async (val) => {
                const user = await User.findOne({ email: val });
                if (user) {
                    throw new Error("Email already taken");
                }
                return true;
            },
        },
    },
    password: {
        in: ["body"],
        exists: {
            errorMessage: "password should exists",
        },
        notEmpty: {
            errorMessage: "password should bot be empty",
        },
        trim: true,
        isLength: {
            options: { min: 4, max: 8 },
            errorMessage: "password should be in between 4 and 8 char",
        },
    },
};

export { userValidationSchema };
