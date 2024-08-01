import mongooes from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongooes.Schema(
    {
        username: { type: String },
        email: { type: String },
        password: { type: String },
        phonenumber: { type: String },
        avatar: {
            url: String,
            public_id: String,
        },
        loggedInAt: [Date],
        accessToken: {
            type: String,
            select: false,
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: String,
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isValidatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

const User = mongooes.model("User", userSchema);

export default User;
