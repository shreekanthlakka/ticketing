import { useLocation } from "react-router";
import Logo from "./Logo";
import styled from "styled-components";
import { Link } from "react-router-dom";

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

function LayoutHeader() {
    const location = useLocation();
    const url = location.pathname;
    return (
        <Container>
            <Logo />
            {url === "/login" ? (
                <Link to="/register">Register</Link>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </Container>
    );
}

export default LayoutHeader;
