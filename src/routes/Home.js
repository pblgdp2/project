import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  IconButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Skeleton,
  Stack,
} from "@mui/material";
import useProject from "../hooks/useProjectHook";
import ProjectCard from "../components/ProjectCard";
import useAppContext from "../hooks/useAppContextHook";
import styled from "styled-components";
import { CancelOutlined } from "@mui/icons-material";
import { categoriesList } from "../utils/constants";
import Login from "../components/Login";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-block: 2rem;
`;

export default function Home() {
  const pageSize = 10;
  const [categoryNameSelected, setCategoryNameSelected] = useState([]);
  const { projectsData, paginationData, getHomeScreenData, loading } = useProject();
  const [searchByCategory, setSearchByCategory] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const {
    appState: { isLoggedIn },
    dispatch,
  } = useAppContext();

  useEffect(() => {
    getHomeScreenData(0, pageSize);
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategoryNameSelected(typeof value === "string" ? value.split(",") : value);
  };

  const onSearch = () => {
    setSearchByCategory(categoryNameSelected);
    getHomeScreenData(0, pageSize, categoryNameSelected);
  };

  const handlePageChange = (e, page) => {
    if (searchByCategory?.length > 0) {
      getHomeScreenData(0, pageSize, searchByCategory);
    } else {
      getHomeScreenData(0, pageSize);
    }
  };

  return (
    <Container>
      <HomeContainer>
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
                      getHomeScreenData(0, pageSize);
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
        {loading
          ? Array(pageSize)
              .fill("")
              .map((item, index) => (
                <Stack spacing={1} key={index}>
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  <Skeleton variant="rectangular" height={60} />
                  <Skeleton variant="circular" width={40} height={40} />
                </Stack>
              ))
          : projectsData.map((item) => (
              <ProjectCard key={item.id} data={item} isHome addComment={false} isLoggedIn={isLoggedIn} onReadMore={() => setShowLogin(true)} />
            ))}
        {paginationData?.totalPages > 1 ? (
          <Pagination count={paginationData?.totalPages} page={paginationData?.currentPage + 1} color="primary" onChange={handlePageChange} />
        ) : null}
      </HomeContainer>
      {showLogin && <Login showCancel onClose={() => setShowLogin(false)} />}
    </Container>
  );
}
