import { useContext, useState } from "react";
import useAppContext from "./useAppContextHook";
import { deleteApi, getApi, postApi } from "../utils/api";
import { categoriesList } from "../utils/constants";

export default function useProject() {
  const [projectsData, setProjectsData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    appState: {
      user: { username, name },
    },
  } = useAppContext();

  const getAllActiveProjects = async (pageNumber = 0, noOfRecords = 10, filterData = {}) => {
    setLoading(true);
    try {
      const resp = await postApi("/blog/page/get", {
        ...filterData,
        noOfRecords,
        pageNumber,
      });
      if (resp) {
        setProjectsData(resp.response);
        setPaginationData({
          totalElements: resp.totalElements,
          totalPages: resp.totalPages,
          currentPage: resp.currentPage,
        });
      } else {
        throw new Error("Unable to fetch projects");
      }
    } catch (error) {
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllProjects = async () => {
    setLoading(true);
    try {
      const resp = await getApi("/blog");
      setProjectsData(resp);
    } catch (error) {
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTrendingProjects = async () => {
    try {
      const resp = await getApi("/blog/trending");
      return resp;
    } catch (error) {
      // throw error;
    }
  };

  const getAllActiveProjectsBySearch = async (pageNumber = 0, noOfRecords = 10, userName = "all", approvedStatus = "true", category = []) => {
    setLoading(true);
    try {
      const resp = await postApi("/blog/page/get/category", {
        param: {
          noOfRecords,
          pageNumber,
          userName,
        },
        category,
        approvedStatus: [true],
        status: ["COMPLETED", "DRAFT", "PENDING"],
        visibility: [true],
      });
      if (resp) {
        setProjectsData(resp.response);
        setPaginationData({
          totalElements: resp.totalElements,
          totalPages: resp.totalPages,
          currentPage: resp.currentPage,
        });
      } else {
        throw new Error("Unable to fetch projects");
      }
    } catch (error) {
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const likeDislikeProject = async (type, id, retResp = false) => {
    try {
      const resp = await postApi(`/blog/${type}/${id}`);
      if (retResp) return resp;
      if (resp === "Liked") {
        setProjectsData((prevState) =>
          prevState.map((item) => ({
            ...item,
            ...(item.id === id
              ? {
                  likes: [...(item.likes || []), username],
                  unlikes: (() => {
                    const index = item.unlikes.indexOf(username);
                    if (index > -1) {
                      item.unlikes.splice(index, 1);
                      return item.unlikes;
                    }
                  })(),
                }
              : {}),
          }))
        );
      } else if (resp === "unliked") {
        setProjectsData((prevState) =>
          prevState.map((item) => ({
            ...item,
            ...(item.id === id
              ? {
                  unlikes: [...(item.unlikes || []), username],
                  likes: (() => {
                    const index = item.likes.indexOf(username);
                    if (index > -1) {
                      item.likes.splice(index, 1);
                      return item.likes;
                    }
                  })(),
                }
              : {}),
          }))
        );
      }
      return resp;
    } catch (error) {
      // throw error;
    }
  };

  const addComment = async (id, val) => {
    try {
      const resp = await postApi(`/blog/addcomment/${id}/${val}`, {});
      if (resp) {
        setProjectsData((prevState) =>
          prevState.map((item) => ({
            ...item,
            ...(item.id === id
              ? {
                  comments: {
                    ...item.comments,
                    [username]: val,
                  },
                }
              : {}),
          }))
        );
        return true;
      } else {
        throw new Error("Unable to fetch projects");
      }
    } catch (error) {
      // throw error;
    }
  };

  const addProject = async (data = {}) => {
    try {
      const resp = await postApi(`/blog/create`, data);
      return resp;
    } catch (error) {
      // throw error;
    }
  };

  const updateProject = async (data = {}, id) => {
    try {
      const resp = await postApi(`/blog/update/${id}`, data);
      return resp;
    } catch (error) {
      // throw error;
    }
  };

  const approveRejectProject = async (type, id) => {
    try {
      const resp = await postApi(`/blog/${type}/${id}`, {});
      getAllProjects();
      return resp;
    } catch (error) {
      // throw error;
    }
  };

  const getCompletedProjects = async (pageNumber = 0, noOfRecords = 10) => {
    setLoading(true);
    try {
      const resp = await postApi("/blog/page/get/category", {
        param: {
          noOfRecords,
          pageNumber,
          userName: "all",
        },
        category: [],
        approvedStatus: [true],
        status: ["COMPLETED"],
        visibility: [true],
      });
      if (resp) {
        setProjectsData(resp.response);
        setPaginationData({
          totalElements: resp.totalElements,
          totalPages: resp.totalPages,
          currentPage: resp.currentPage,
        });
      } else {
        throw new Error("Unable to fetch projects");
      }
    } catch (error) {
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardData = async (year = new Date().getFullYear()) => {
    try {
      const respSummary = await getApi(`/blog/userDashboardSummary/${year}`);
      const resp = await getApi(`/blog/dashboard/year/${year}/${username}`);
      const respData = await getApi(`/blog/getapprovedAndUnApproved`);
      return {
        graphData: resp,
        data: respData,
        summary: respSummary,
      };
    } catch (error) {
      // throw error;
    }
  };

  const getDashboardUsersCount = async (year = new Date().getFullYear(), month = new Date().getMonth()) => {
    try {
      const respUsers = await getApi(`/blog/blogUsersCount/yearmonth/${year}/${month > 9 ? month : "0" + month}`);
      return respUsers;
    } catch (error) {
      // throw error;
    }
  };

  const getDashboardCategoryCount = async (year = new Date().getFullYear()) => {
    try {
      const respCategory = await getApi(`/blog/dashboard/year/${year}`);
      return respCategory;
    } catch (error) {
      // throw error;
    }
  };

  const getapprovedAndUnApproved = async () => {
    try {
      const respData = await getApi(`/blog/getapprovedAndUnApproved`);
      return respData;
    } catch (error) {
      // throw error;
    }
  };

  const getRequestedApprovals = async () => {
    try {
      const resp = await postApi("/blog/page/get/category", {
        param: {
          noOfRecords: 10000,
          pageNumber: 0,
          userName: username,
        },
        category: categoriesList,
        approvedStatus: [true],
        status: ["COMPLETED", "PENDING", "DRAFT"],
        visibility: [true],
      });
      return resp;
    } catch (error) {}
  };

  const getHomeScreenData = async (pageNumber, noOfRecords, categories = []) => {
    setLoading(true);
    try {
      const resp = await postApi(
        "/blog/page/get/category",
        {
          param: {
            noOfRecords,
            pageNumber,
            userName: "all",
          },
          category: categories.length ? categories : categoriesList,
          approvedStatus: [true],
          status: ["COMPLETED"],
          visibility: [true],
        },
        false
      );
      if (resp) {
        setProjectsData(resp.response);
        setPaginationData({
          totalElements: resp.totalElements,
          totalPages: resp.totalPages,
          currentPage: resp.currentPage,
        });
      } else {
        throw new Error("Unable to fetch projects");
      }
    } catch (error) {
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMyProjectsByFilter = async (pageNumber, noOfRecords, filter) => {
    setLoading(true);
    try {
      const resp = await postApi(
        "/blog/page/get/category",
        {
          param: {
            noOfRecords,
            pageNumber,
            userName: username,
          },
          category: categoriesList,
          ...filter,
        },
        false
      );
      if (resp) {
        setProjectsData(resp.response);
        setPaginationData({
          totalElements: resp.totalElements,
          totalPages: resp.totalPages,
          currentPage: resp.currentPage,
        });
      } else {
        throw new Error("Unable to fetch projects");
      }
    } catch (error) {
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestProject = async (id) => {
    try {
      const resp = await getApi(`/blog/request/${id}`);
      return resp;
    } catch (error) {
      // throw error;
    }
  };

  const approveProjectRequest = async (user, id) => {
    try {
      const resp = await getApi(`/blog/approverequest/${id}/${user}`);
      return resp;
    } catch (error) {
      // throw error;
    }
  };

  const deleteProject = async (id) => {
    try {
      const resp = await deleteApi(`/blog/delete/${id}`, {});
      return resp;
    } catch (error) {
      // throw error;
    }
  };

  const deleteComment = async (email, id) => {
    try {
      const resp = await deleteApi(`/blog/deleteComment/${id}/${email}`, {});
      if (resp) {
        setProjectsData((prevState) =>
          prevState.map((item) => {
            const comments = item.id === id ? item.comments : {};
            delete comments[email];
            return {
              ...item,
              ...(item.id === id
                ? {
                    comments: comments,
                  }
                : {}),
            };
          })
        );
        return true;
      } else {
        throw new Error("Unable to fetch projects");
      }
    } catch (error) {
      // throw error;
    }
  };

  return {
    getAllActiveProjects,
    addComment,
    likeDislikeProject,
    addProject,
    getAllActiveProjectsBySearch,
    getAllProjects,
    approveRejectProject,
    getCompletedProjects,
    getDashboardData,
    getHomeScreenData,
    getMyProjectsByFilter,
    updateProject,
    getapprovedAndUnApproved,
    requestProject,
    getRequestedApprovals,
    approveProjectRequest,
    deleteProject,
    deleteComment,
    getTrendingProjects,
    getDashboardCategoryCount,
    getDashboardUsersCount,
    projectsData,
    paginationData,
    loading,
  };
}
