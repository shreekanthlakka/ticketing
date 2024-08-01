import { Outlet } from "react-router";
import Header from "./Header";
import styled from "styled-components";

const Container = styled.main``;

const Main = styled.main`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
`;

function AppLayout() {
    return (
        <Container>
            <Header />
            <Main>
                <Outlet />
            </Main>
        </Container>
    );
}

export default AppLayout;
