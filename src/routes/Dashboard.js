import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, FormControl, FormLabel, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import useProject from "../hooks/useProjectHook";
import { BarChart } from "@mui/x-charts";
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
`;

export default function Dashboard() {
  const yearList = Array(30)
    .fill(0)
    .map((item, index) => 2000 + index);
  const [dashboardData, setDashboardData] = useState({
    graphData: {},
    data: {},
  });
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  const { getDashboardData, likeDislikeProject, addComment, getapprovedAndUnApproved } = useProject();
  const {
    appState: {
      user: { username },
    },
  } = useAppContext();

  const barContainerRef = useRef();

  useEffect(() => {
    setLoading(true);
    getDashboardData()
      .then((resp) => {
        setDashboardData(resp);
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
          <Grid item xs={12} sm={12} md={9}>
            <CardContainer ref={barContainerRef}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", paddingInline: "1rem" }}>
                <FormControl size="small">
                  <InputLabel>Year</InputLabel>
                  <Select size="small" label="Year" value={year} onChange={(e) => setYear(e.target.value)}>
                    {yearList.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
              <CardContainer style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#ceefce" }}>
                <Typography variant="h6">Approved</Typography>
                <Typography variant="body1">{dashboardData?.data?.["approved count"]}</Typography>
              </CardContainer>
              <CardContainer style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#d3a3ff" }}>
                <Typography variant="h6">Pending</Typography>
                <Typography variant="body2">{dashboardData?.data?.["pending count"]}</Typography>
              </CardContainer>
            </div>
          </Grid>
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
