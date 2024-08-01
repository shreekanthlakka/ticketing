const ticketValidationSchema = {
    title: {
        in: ["body"],
        exists: {
            errorMessage: "title is required",
        },
        notEmpty: {
            errorMessage: "title cannot be empty",
        },
        trim: true,
    },
    price: {
        in: ["body"],
        exists: {
            errorMessage: "price is required",
        },
        notEmpty: {
            errorMessage: "price cannot be empty",
        },
        trim: true,
    },
    userId: {
        custom: {
            options: (val, { req }) => {
                if (!req.user._id) {
                    throw new Error("Not signed In or Invalid token");
                }
                return true;
            },
        },
    },
};

export { ticketValidationSchema };
