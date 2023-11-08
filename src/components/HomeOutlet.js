import { Avatar, Button, Container, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Login from "./Login";
import { useEffect, useState } from "react";
import logo from "../assets/N-Horiz-Full.png";
import useAppContext from "../hooks/useAppContextHook";

const HeaderHome = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AppButtons = styled.div`
  display: flex;
  align-items: center;
  padding-block: 0.5rem;
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 50px;
  min-height: 100vh;
`;

export default function HomeOutlet() {
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();

  const {
    appState: { isLoggedIn },
  } = useAppContext();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn]);

  return (
    <Main>
      <header style={{ position: "sticky", top: 0, backgroundColor: "#e9eff2", zIndex: 9999 }}>
        <Container>
          <HeaderHome>
            <img src={logo} style={{ height: "60px", paddingBlock: "5px" }} />
            <AppButtons>
              <Button onClick={() => navigate("/")}>Home</Button>
              <Button onClick={() => navigate("/about")}>About</Button>
              <Button onClick={() => setShowLogin(true)}>Login/Signup</Button>
            </AppButtons>
          </HeaderHome>
        </Container>
      </header>
      <main style={{ height: "100%" }}>
        <Outlet />
      </main>
      <Footer>
        <Typography variant="caption">© 2023 Professional Based Learning</Typography>
      </Footer>
      {showLogin && <Login showCancel onClose={() => setShowLogin(false)} />}
    </Main>
  );
}
