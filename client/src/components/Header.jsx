import { useLocation, useNavigate } from "react-router";
import Logo from "./Logo";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";

const Container = styled.div`
    background-color: #b6afae;
    height: 8vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & a {
        text-decoration: none;
        margin-right: 1rem;
    }
    & button {
        margin-right: 1rem;
    }
`;

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const url = location.pathname;
    const { userAccount, logout, isLoading } = useAuth();
    const links = [{ name: "Account", path: "/account" }];

    async function handleLogout() {
        const res = await logout();
        if (res.success) {
            toast.success("LoggedOut sucessfully");
            navigate("/login");
        }
    }

    return (
        <Container>
            <Logo />
            <div>
                {links.map((ele) => (
                    <Link key={ele.name} to={ele.path}>
                        {ele.name}
                    </Link>
                ))}
                {Object.keys(userAccount).length > 0 && (
                    <Button
                        variant="contained"
                        onClick={handleLogout}
                        disabled={isLoading}
                    >
                        {isLoading ? "LoggingOut" : "Logout"}
                    </Button>
                )}
            </div>
        </Container>
    );
}

export default Header;
