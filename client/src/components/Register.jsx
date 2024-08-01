import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styled from "styled-components";
import { useState } from "react";
import { isEmail } from "validator";
import { registerApi } from "../services/userService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    & input {
        width: 20rem;
    }
    .error {
        color: red;
        font-size: small;
    }
`;

const initialState = {
    username: "one",
    email: "one@gmail.com",
    password: "123456",
};

function Register() {
    const [formData, setFormData] = useState(initialState);
    const [clientErrors, setClientErrors] = useState({});
    // const [serverErrors, setServerErrors] = useState({});
    const cliErrors = {};
    const navigate = useNavigate();

    function runValidations() {
        if (formData.username.trim().length === 0) {
            cliErrors.username = "username field is required";
        }
        if (formData.email.trim().length === 0) {
            cliErrors.email = "Email field is required";
        } else if (!isEmail(formData.email)) {
            cliErrors.email = "invalid email";
        }
        if (formData.password.trim().length === 0) {
            cliErrors.password = "Password is required";
        } else if (
            formData.password.trim().length < 6 ||
            formData.password.trim().length > 12
        ) {
            cliErrors.password =
                "password length should be in 6 and 12 characters";
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        runValidations();
        if (Object.keys(cliErrors).length === 0) {
            // api call
            const res = await registerApi(formData);
            if (res.success) {
                toast.success(res.message);
                navigate("/login");
            }

            setClientErrors({});
        } else {
            setClientErrors(cliErrors);
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <TextField
                    label="name"
                    variant="outlined"
                    value={formData.username}
                    onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                    }
                />
                {clientErrors.name && (
                    <p className="error">{clientErrors.name}</p>
                )}
                <TextField
                    label="Email"
                    variant="outlined"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                />
                {clientErrors.email && (
                    <p className="error">{clientErrors.email}</p>
                )}
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                />
                {clientErrors.password && (
                    <p className="error">{clientErrors.password}</p>
                )}
                <Button variant="contained" type="submit">
                    Register
                </Button>
            </Form>
        </div>
    );
}

export default Register;
