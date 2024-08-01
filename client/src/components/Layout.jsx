import { Outlet, useNavigate } from "react-router";
import LayoutHeader from "./LayoutHeader";
import styled from "styled-components";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Main = styled.main`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
`;

function Layout() {
    const { userAccount, isLoading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (userAccount && !isLoading) {
            navigate("/dashboard");
        }
    }, [userAccount, isLoading, navigate]);
    return (
        <div>
            <LayoutHeader />
            <Main>
                <Outlet />
            </Main>
        </div>
    );
}

export default Layout;
