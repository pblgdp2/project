import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, FormControl, FormLabel, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import useProject from "../hooks/useProjectHook";
import { BarChart, PieChart } from "@mui/x-charts";
import styled from "styled-components";
import ProjectCard from "../components/ProjectCard";
import useAppContext from "../hooks/useAppContextHook";

const CardContainer = styled.div`
  display: "flex";
  flex-direction: column;
  background-color: whitesmoke;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0px 5px 3px rgba(202, 239, 255, 0.43);
`;

const ProjectCardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  padding-inline: 0;
`;

export default function Dashboard() {
  const yearList = Array(30)
    .fill(0)
    .map((item, index) => 2000 + index);
  const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [dashboardData, setDashboardData] = useState({
    graphData: {},
    data: {},
    summary: {},
  });
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [categoryYear, setCategoryYear] = useState(new Date().getFullYear());
  const [categoryMonth, setCategoryMonth] = useState(monthList[new Date().getMonth()]);
  const [usersMonth, setUsersMonth] = useState(monthList[new Date().getMonth()]);
  const [usersYear, setUsersYear] = useState(new Date().getFullYear());
  const [categoryData, setCategoryData] = useState({});
  const [userData, setUserData] = useState({});
  const [trendingProjects, setTrendingProjects] = useState([]);

  const {
    getDashboardData,
    likeDislikeProject,
    addComment,
    getapprovedAndUnApproved,
    getTrendingProjects,
    getDashboardCategoryCount,
    getDashboardUsersCount,
  } = useProject();
  const {
    appState: {
      user: { username, isAdmin },
    },
  } = useAppContext();

  const barContainerRef = useRef();
  const barContainerAdminRef = useRef();

  useEffect(() => {
    setLoading(true);
    getDashboardData()
      .then(async (resp) => {
        setDashboardData(resp);
        if (isAdmin) {
          try {
            const data = await getDashboardCategoryCount();
            setCategoryData(data);
            const users = await getDashboardUsersCount();
            setUserData(users || {});
          } catch (error) {}
        }
        try {
          const trendingData = await getTrendingProjects();
          setTrendingProjects(trendingData?.top5liked || []);
        } catch (error) {}
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLikeDisLikeClick = async (type, id) => {
    try {
      await likeDislikeProject(type, id, true);
      const data = await getapprovedAndUnApproved();
      setDashboardData((prevState) => ({
        ...prevState,
        data,
      }));
    } catch (error) {}
  };

  const handleAddComment = async (id, value) => {
    if (value) {
      const respData = await addComment(id, value);
      const data = await getapprovedAndUnApproved();
      setDashboardData((prevState) => ({
        ...prevState,
        data,
      }));
      return respData;
    }
  };

  const handleAttachmentDownload = async (base64) => {
    const base64Img = `data:image/png;base64,${base64}`;
    const a = document.createElement("a");
    a.href = base64Img;
    a.download = "Download File.png";
    a.click();
  };

  return (
    <div>
      {!loading ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3} display="flex">
                <CardContainer style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#9FBB73", width: "100%" }}>
                  <Typography variant="h6">Requested Approved</Typography>
                  <Typography variant="body1">{dashboardData?.summary?.["approvedForMe"]}</Typography>
                </CardContainer>
              </Grid>
              <Grid item xs={12} sm={6} md={3} display="flex">
                <CardContainer style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#F1EB90", width: "100%" }}>
                  <Typography variant="h6">My Approved Projects</Typography>
                  <Typography variant="body2">{dashboardData?.summary?.["approvedforMyBlogs"]}</Typography>
                </CardContainer>
              </Grid>
              <Grid item xs={12} sm={6} md={3} display="flex">
                <CardContainer style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#F3B664", width: "100%" }}>
                  <Typography variant="h6">My Project Requests</Typography>
                  <Typography variant="body2">{dashboardData?.summary?.["requestedByMe"]}</Typography>
                </CardContainer>
              </Grid>
              <Grid item xs={12} sm={6} md={3} display="flex">
                <CardContainer style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#EC8F5E", width: "100%" }}>
                  <Typography variant="h6">Requested Projects</Typography>
                  <Typography variant="body2">{dashboardData?.summary?.["requestsforMyBlogs"]}</Typography>
                </CardContainer>
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} sm={12} md={9}>
            <CardContainer ref={barContainerRef}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingInline: "1rem" }}>
                <Typography variant="h6">My Projects</Typography>
                <FormControl size="small">
                  <InputLabel>Year</InputLabel>
                  <Select
                    size="small"
                    label="Year"
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      getDashboardData(e.target.value)
                        .then(async (resp) => {
                          setDashboardData(resp);
                        })
                        .catch(console.error);
                    }}
                  >
                    {yearList.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div style={{ width: "100%" }}>
                <BarChart
                  xAxis={[
                    {
                      id: "barCategories",
                      data: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
                      scaleType: "band",
                      label: "Month",
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Projects",
                    },
                  ]}
                  series={[
                    {
                      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => {
                        const { graphData } = dashboardData;
                        return graphData[item] || 0;
                      }),
                    },
                  ]}
                  width={barContainerRef?.current?.clientWidth}
                  height={300}
                />
              </div>
            </CardContainer>
          </Grid> */}
          <Grid item xs={12} sm={12} md={3}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <CardContainer style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#b8e96c" }}>
                <Typography variant="h6">Approved Projects</Typography>
                <Typography variant="body1">{dashboardData?.data?.["approved count"]}</Typography>
              </CardContainer>
              <CardContainer style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#ff8f8f" }}>
                <Typography variant="h6">Pending Approval</Typography>
                <Typography variant="body1">{dashboardData?.data?.["pending count"]}</Typography>
              </CardContainer>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={9}></Grid>
          {isAdmin ? (
            <>
              <Grid item xs={12} sm={12} md={12}>
                <CardContainer ref={barContainerAdminRef}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingInline: "1rem", gap: "0.5rem" }}>
                    <Typography variant="h6">By Users</Typography>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                      <FormControl size="small">
                        <InputLabel>Month</InputLabel>
                        <Select
                          size="small"
                          label="Month"
                          value={usersMonth}
                          onChange={(e) => {
                            setUsersMonth(e.target.value);
                            getDashboardUsersCount(usersYear, monthList.indexOf(e.target.value)).then(setUserData).catch(console.error);
                          }}
                        >
                          {monthList.map((item, index) => (
                            <MenuItem key={item} name={index} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small">
                        <InputLabel>Year</InputLabel>
                        <Select
                          size="small"
                          label="Year"
                          value={usersYear}
                          onChange={(e) => {
                            setUsersYear(e.target.value);
                            getDashboardUsersCount(e.target.value, monthList.indexOf(usersMonth)).then(setUserData).catch(console.error);
                          }}
                        >
                          {yearList.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: Object.keys(userData).length > 0 ? Object.keys(userData) : [" "],
                        scaleType: "band",
                        label: "Users",
                      },
                    ]}
                    yAxis={[
                      {
                        label: "Projects",
                      },
                    ]}
                    series={[
                      {
                        data: Object.keys(userData).length > 0 ? Object.keys(userData).map((item) => userData[item]) : [0],
                      },
                    ]}
                    width={barContainerAdminRef?.current?.clientWidth}
                    height={300}
                  />
                </CardContainer>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <CardContainer className="piechart-container">
                  <div style={{ display: "flex", justifyContent: "space-between", paddingInline: "1rem", gap: "0.5rem" }}>
                    <Typography variant="h6">By Category</Typography>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                      <FormControl size="small">
                        <InputLabel>Year</InputLabel>
                        <Select
                          size="small"
                          label="Year"
                          value={categoryYear}
                          onChange={(e) => {
                            setCategoryYear(e.target.value);
                            getDashboardCategoryCount(e.target.value, monthList.indexOf(categoryMonth)).then(setCategoryData).catch(console.error);
                          }}
                        >
                          {yearList.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <PieChart
                    series={[
                      {
                        data: Object.keys(categoryData).map((item, index) => ({
                          id: index,
                          value: categoryData[item],
                          label: item,
                        })),
                        highlightScope: { faded: "global", highlighted: "item" },
                        faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                      },
                    ]}
                    height={300}
                  />
                </CardContainer>
              </Grid>
            </>
          ) : null}
          {trendingProjects && trendingProjects.length > 0 ? (
            <Grid item xs={12} sm={12} md={12}>
              <ProjectCardGrid>
                <Typography variant="h6">Trending</Typography>
                {trendingProjects.map((item) => (
                  <ProjectCard
                    key={item?.id}
                    data={item}
                    onClickLike={() => handleLikeDisLikeClick("like", item.id, "liked")}
                    onClickDisLike={() => handleLikeDisLikeClick("unlike", item.id, "liked")}
                    onAddComment={handleAddComment}
                    onAttachmentDownload={handleAttachmentDownload}
                    username={username}
                  />
                ))}
              </ProjectCardGrid>
            </Grid>
          ) : null}
          <Grid item xs={12} sm={12} md={6}>
            <ProjectCardGrid>
              <Typography variant="h6">Top 5 Liked</Typography>
              {dashboardData?.data?.top5liked?.map((item) => (
                <ProjectCard
                  key={item?.id}
                  data={item}
                  onClickLike={() => handleLikeDisLikeClick("like", item.id, "liked")}
                  onClickDisLike={() => handleLikeDisLikeClick("unlike", item.id, "liked")}
                  onAddComment={handleAddComment}
                  onAttachmentDownload={handleAttachmentDownload}
                  username={username}
                />
              ))}
            </ProjectCardGrid>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ProjectCardGrid>
              <Typography variant="h6">Top 5 Unliked</Typography>
              {dashboardData?.data?.top5Unliked?.map((item) => (
                <ProjectCard
                  key={item?.id}
                  data={item}
                  onClickLike={() => handleLikeDisLikeClick("like", item.id, "unliked")}
                  onClickDisLike={() => handleLikeDisLikeClick("unlike", item.id, "unliked")}
                  onAddComment={handleAddComment}
                  onAttachmentDownload={handleAttachmentDownload}
                  username={username}
                />
              ))}
            </ProjectCardGrid>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ display: "flex", height: "calc(100vh - 150px)", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}
