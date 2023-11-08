import "./App.css";
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Projects from "./routes/Projects";
import styled from "styled-components";
import {
  Avatar,
  Button,
  Checkbox,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddProject from "./routes/AddProject";
import Profile from "./routes/Profile";
import Dashboard from "./routes/Dashboard";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import AppContext from "./hooks/appContext";
import useAppContext from "./hooks/useAppContextHook";
import ProfileForm from "./components/ProfileForm";
import MyProjects from "./routes/MyProjects";
import useUser from "./hooks/useUserHook";
import { categoriesList } from "./utils/constants";
import { CancelOutlined } from "@mui/icons-material";
import Admin from "./routes/Admin";
import Home from "./routes/Home";
import AboutPage from "./routes/About";
import HomeOutlet from "./components/HomeOutlet";
import Chat from "./components/Chat/Chat";
import logo from "./assets/N-Horiz-Full.png";
import Requests from "./routes/Requests";

const LoggedInAppContainer = styled.div`
  display: grid;
  grid-template-areas:
    "sidenav header"
    "sidenav maincontent";
  grid-template-rows: 70px 1fr;
  grid-template-columns: 240px 1fr;
  overflow: hidden;
  height: 100vh;
`;

const Header = styled.div`
  grid-area: header;
  background-color: whitesmoke;
  display: flex;
  align-items: center;
`;

const LeftSideNav = styled.div`
  grid-area: sidenav;
  background-color: whitesmoke;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MainContent = styled.div`
  grid-area: maincontent;
  overflow: auto;
  padding: 2rem;
`;

function LoggedInApp() {
  const [pathActive, setPathActive] = useState("/");
  const [showUserProfileView, setShowUserProfileView] = useState(false);
  const [categoryNameSelected, setCategoryNameSelected] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [sideNavElements, setSideNavElements] = useState([
    { path: "/dashboard", label: "Dashboard", icon: "" },
    { path: "/projects", label: "Projects", icon: "" },
    { path: "/addproject", label: "Add New Project", icon: "" },
    { path: "/myprojects", label: "My Projects", icon: "" },
    { path: "/requests", label: "Project Requests", icon: "" },
    { path: "/admin", label: "Admin", icon: "" },
    { path: "/profile", label: "Profile", icon: "" },
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  const { appState, dispatch } = useAppContext();
  const {
    isLoggedIn,
    isProfileLoading,
    profile,
    isProfileAvailable,
    initialGetProfile,
    user: { username, token, authorities },
  } = appState;

  const { getUserProfile } = useUser();

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/dashboard");
  //   } else {
  //     navigate("/");
  //   }
  // }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && initialGetProfile && !isProfileAvailable) {
      setShowUserProfileView(true);
    } else {
      setShowUserProfileView(false);
    }
  }, [isLoggedIn, initialGetProfile, isProfileAvailable]);

  useEffect(() => {
    if (isLoggedIn && !initialGetProfile && username && token) {
      getUserProfile(username, token).catch(console.error);
    }
  }, [isLoggedIn, initialGetProfile]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategoryNameSelected(typeof value === "string" ? value.split(",") : value);
  };

  const onSearch = () => {
    dispatch({ type: "SEARCH_BY_CATEGORY", payload: categoryNameSelected });
  };

  return (
    <LoggedInAppContainer>
      <Header>
        {location?.pathname === "/projects" ? (
          <div
            style={{
              width: "100%",
              paddingInline: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <FormControl size="small" fullWidth>
              <Select
                multiple
                displayEmpty
                value={categoryNameSelected}
                onChange={handleChange}
                fullWidth
                input={<OutlinedInput />}
                endAdornment={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        dispatch({ type: "SEARCH_BY_CATEGORY", payload: [] });
                        setCategoryNameSelected([]);
                      }}
                    >
                      <CancelOutlined />
                    </IconButton>
                    <Button size="small" variant="outlined" onClick={onSearch}>
                      Search
                    </Button>
                  </div>
                }
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return "Search by categories";
                  }
                  return selected.join(", ");
                }}
              >
                {categoriesList.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={categoryNameSelected.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ) : null}
      </Header>
      <LeftSideNav>
        <div>
          <div style={{ display: "flex", height: "70px", alignItems: "center", justifyContent: "center" }}>
            <img style={{ width: "auto", maxHeight: "50px" }} src={logo} />
          </div>
          <List component="nav" style={{ padding: 0 }}>
            {sideNavElements
              .filter((item) => {
                const { path } = item;
                if (path === "/admin") {
                  if (authorities === "ROLE_ADMIN") {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }
              })
              .map((item) => (
                <ListItemButton
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  style={location?.pathname === item.path ? { backgroundColor: "#e9eff2" } : {}}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
          </List>
        </div>
        <List component="nav" style={{ padding: 0 }}>
          {username && (
            <ListItem>
              <ListItemText
                primary={<Typography variant="body2">Loggedin as</Typography>}
                secondary={<Typography variant="body2">{username}</Typography>}
              />
            </ListItem>
          )}
          <ListItemButton
            onClick={() => {
              dispatch({ type: "LOGOUT" });
              navigate("/");
            }}
          >
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </LeftSideNav>
      <MainContent>
        <Outlet />
        {isLoggedIn && <Chat />}
      </MainContent>
      {!isLoggedIn && <Login />}
      {showUserProfileView && <ProfileForm />}
    </LoggedInAppContainer>
  );
}

function App() {
  return (
    <AppContext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeOutlet />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
          <Route path="/" element={<LoggedInApp />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects filterBy="true" />} />
            <Route path="/addproject" element={<AddProject />} />
            <Route path="/myprojects" element={<MyProjects />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/myprojects/edit" element={<AddProject />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext>
  );
}

export default App;
