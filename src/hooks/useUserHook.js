import { deleteApi, getApi, postApi, putApi } from "../utils/api";
import useAppContext from "./useAppContextHook";

export default function useUser() {
  const {
    dispatch,
    appState: {
      user: { username },
    },
  } = useAppContext();

  const userLogin = async (data = {}) => {
    try {
      const resp = await postApi("/user/authenticate", data, false);
      if (resp) {
        dispatch({ type: "LOGIN", payload: resp });
      } else {
        throw new Error("Invalid credentials");
      }
      return resp;
    } catch (error) {
      throw error;
    }
  };

  const userSignUp = async (data = {}) => {
    try {
      const resp = await postApi("/user/new", data, false);
      if (resp) {
        return true;
      } else {
        throw new Error("Unable to create new user");
      }
    } catch (error) {
      throw error;
    }
  };

  const getUserProfile = async (username, token, returnData = false) => {
    dispatch({ type: "PROFILE_LOADING", payload: true });
    try {
      const resp = await getApi(`/profile/get/${username}`, token);
      if (resp && typeof resp === "string") {
        if (returnData) {
          return null;
        } else {
          dispatch({
            type: "PROFILE_UPDATE",
            payload: {
              data: {},
              available: false,
            },
          });
        }
      } else if (resp) {
        if (returnData) {
          return resp;
        } else {
          dispatch({
            type: "PROFILE_UPDATE",
            payload: {
              data: resp,
              available: true,
            },
          });
        }
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: "PROFILE_LOADING", payload: false });
    }
  };

  const addProfile = async (data = {}) => {
    try {
      const resp = await postApi("/profile/create", data);
      if (resp && typeof resp !== "string") {
        dispatch({
          type: "PROFILE_UPDATE",
          payload: {
            data: resp,
            available: true,
          },
        });
      }
      return resp;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data = {}) => {
    try {
      const resp = await putApi(`/profile/update/${username}`, data);
      if (resp && typeof resp !== "string") {
        dispatch({
          type: "PROFILE_UPDATE",
          payload: {
            data: resp,
            available: true,
          },
        });
      }
      return resp;
    } catch (error) {
      throw error;
    }
  };

  const sendCode = async (email) => {
    try {
      const resp = await postApi("/user/sendCode", { email }, false);
      if (resp) {
        return true;
      } else {
        throw new Error("Unable to create or email already exists");
      }
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const resp = await postApi("/user/forgotPassword", { email }, false);
      if (resp) {
        return true;
      } else {
        throw new Error("Unable to reset password");
      }
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async ({ email, code, password }) => {
    try {
      const resp = await postApi(`/user/changePassword/${code}/${email}/${password}`, {}, false);
      if (resp) {
        return true;
      } else {
        throw new Error("Unable to change new password");
      }
    } catch (error) {
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const data = await getApi("/user/all");
      return data;
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (email = "") => {
    try {
      const data = await deleteApi(`/user/delete/${email}`, { email });
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    userLogin,
    userSignUp,
    getUserProfile,
    addProfile,
    updateProfile,
    sendCode,
    forgotPassword,
    changePassword,
    getAllUsers,
    deleteUser,
  };
}
