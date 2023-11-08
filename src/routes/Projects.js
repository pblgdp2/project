import styled from "styled-components";
import ProjectCard from "../components/ProjectCard";
import useProject from "../hooks/useProjectHook";
import { useEffect, useState } from "react";
import { Pagination, Skeleton, Stack, TextField, Typography } from "@mui/material";
import useAppContext from "../hooks/useAppContextHook";
import { useLocation } from "react-router-dom";

const ProjectContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-rows: auto;
`;

export default function Projects({
  filterBy = "all",
  addedBy = "all",
  isAdmin = false,
  showSearch = false,
  showSearchPagination = false,
  myProjects = false,
  filterData,
}) {
  const pageSize = 10;

  const [searchVal, setSearchVal] = useState("");
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    getAllActiveProjects,
    getAllActiveProjectsBySearch,
    addComment,
    getAllProjects,
    approveRejectProject,
    projectsData,
    paginationData,
    loading,
    likeDislikeProject,
    getMyProjectsByFilter,
    requestProject,
    deleteProject,
    deleteComment,
  } = useProject();
  const {
    appState: {
      user: { username },
      searchByCategory = [],
    },
  } = useAppContext();

  const location = useLocation();

  useEffect(() => {
    if (isAdmin) {
      const projs = (projectsData || []).filter((item) => {
        const { approvedBy, approved, sub } = item;
        if (!approvedBy && !approved && sub?.toLowerCase()?.includes(searchVal)) return true;
        else return false;
      });
      setProjects([...projs]);
    } else {
      setProjects(projectsData);
    }
  }, [projectsData, searchVal]);

  useEffect(() => {
    if (myProjects) {
      getMyProjectsByFilter(0, pageSize, filterData);
    } else {
      if (isAdmin) {
        getAllProjects();
      } else {
        if (location?.pathname === "/projects" && searchByCategory?.length > 0) {
          getAllActiveProjectsBySearch(0, pageSize, addedBy, filterBy === "all" ? "false" : filterBy, searchByCategory);
        } else {
          getAllActiveProjects(0, pageSize, {
            userName: addedBy,
            approvedStatus: filterBy === "all" ? false : filterBy,
          });
        }
      }
    }
  }, [filterBy, addedBy, location?.pathname, searchByCategory, myProjects, filterData]);
  // }, [filterData]);

  const handlePageChange = (e, page) => {
    if (location?.pathname === "/projects" && searchByCategory?.length > 0) {
      getAllActiveProjectsBySearch(0, pageSize, addedBy, filterBy === "all" ? "false" : filterBy, searchByCategory);
    } else {
      getAllActiveProjects(page <= 0 ? 0 : page - 1, pageSize, {
        userName: addedBy,
        approvedStatus: filterBy === "all" ? false : filterBy,
      });
    }
  };

  const handleLikeDisLikeClick = async (type, id) => {
    likeDislikeProject(type, id);
  };

  const handleAddComment = async (id, value) => {
    if (value) {
      return await addComment(id, value);
    }
  };

  const handleDeleteComment = async (email, id) => {
    deleteComment(email, id);
  };

  const handleAttachmentDownload = async (base64) => {
    const base64Img = `data:image/png;base64,${base64}`;
    const a = document.createElement("a");
    a.href = base64Img;
    a.download = "Download File.png";
    a.click();
  };

  const handleOnApproveReject = (type, data) => {
    if (isAdmin) {
      const { id } = data;
      approveRejectProject(type, id).catch(console.error);
    }
  };

  const handleOnDelete = async (data) => {
    try {
      const { crtdBy, id } = data;
      if (crtdBy === username) {
        await deleteProject(id);
        await getMyProjectsByFilter(0, pageSize, filterData);
      }
    } catch (error) {}
  };

  const handleProjectRequest = async ({ id }) => {
    try {
      await requestProject(id);
      setProjects((prevState) => [
        ...prevState.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              projectRequests: {
                ...item.projectRequests,
                [username]: false,
              },
            };
          } else {
            return item;
          }
        }),
      ]);
    } catch (error) {}
  };

  return (
    <ProjectContainer>
      {loading ? (
        Array(pageSize)
          .fill("")
          .map((item, index) => (
            <Stack spacing={1} key={index}>
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="rectangular" height={60} />
              <Skeleton variant="circular" width={40} height={40} />
            </Stack>
          ))
      ) : projects?.length > 0 || isAdmin ? (
        <ProjectContainer>
          {showSearch && (
            <TextField
              size="small"
              placeholder="Search Project"
              fullWidth
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value?.toLowerCase())}
            />
          )}
          {projects.slice((currentPage - 1) * pageSize, pageSize * currentPage).map((item) => (
            <ProjectCard
              key={item.id}
              data={item}
              onClickLike={() => handleLikeDisLikeClick("like", item.id)}
              onClickDisLike={() => handleLikeDisLikeClick("unlike", item.id)}
              onAddComment={handleAddComment}
              onAttachmentDownload={handleAttachmentDownload}
              username={username}
              isAdmin={isAdmin}
              onApprove={() => handleOnApproveReject("approve", item)}
              onReject={() => handleOnApproveReject("reject", item)}
              isEdit={myProjects}
              requestProject={Object.keys(item?.projectRequests).indexOf(username) > -1 || item?.crtdBy === username ? false : true}
              onRequestProject={handleProjectRequest}
              onDelete={handleOnDelete}
              onCommentDelete={handleDeleteComment}
            />
          ))}
          {paginationData?.totalPages > 1 ? (
            <Pagination count={paginationData?.totalPages} page={paginationData?.currentPage + 1} color="primary" onChange={handlePageChange} />
          ) : null}
          {isAdmin ? (
            <Pagination
              count={Math.ceil(projects.length / pageSize)}
              page={currentPage}
              color="primary"
              onChange={(e, page) => {
                setCurrentPage(page);
              }}
            />
          ) : null}
        </ProjectContainer>
      ) : (
        <div>
          <Typography>No data found</Typography>
        </div>
      )}
    </ProjectContainer>
  );
}
