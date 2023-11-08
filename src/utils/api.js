import axios from "axios";

export const postApi = async (url, payload = {}, useToken = true) => {
  try {
    const localState = localStorage.getItem("localstate");
    let appToken = "";
    if (localState) {
      const { token } = JSON.parse(localState);
      appToken = token;
    }
    const headers = {
      headers: {
        Authorization: useToken ? "Bearer " + appToken : "",
      },
    };
    const response = await axios.post(url, payload, headers);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data.message;
    } else if (error.request) {
      return error.request;
    } else {
      return error.message;
    }
  }
};

export const putApi = async (url, payload = {}) => {
  try {
    const localState = localStorage.getItem("localstate");
    let appToken = "";
    if (localState) {
      const { token } = JSON.parse(localState);
      appToken = token;
    }
    const headers = {
      headers: {
        Authorization: "Bearer " + appToken,
      },
    };
    const response = await axios.put(url, payload, headers);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data.message;
    } else if (error.request) {
      return error.request;
    } else {
      return error.message;
    }
  }
};

export const getApi = async (url, userToken = "") => {
  try {
    const localState = localStorage.getItem("localstate");
    let appToken = userToken;
    if (localState && !userToken) {
      const { token } = JSON.parse(localState);
      appToken = token;
    }
    const headers = {
      headers: {
        Authorization: "Bearer " + appToken,
      },
    };
    const response = await axios.get(url, headers);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data.message;
    } else if (error.request) {
      return error.request;
    } else {
      return error.message;
    }
  }
};

export const deleteApi = async (url, payload = {}, useToken = true) => {
  try {
    const localState = localStorage.getItem("localstate");
    let appToken = "";
    if (localState) {
      const { token } = JSON.parse(localState);
      appToken = token;
    }
    const headers = {
      headers: {
        Authorization: useToken ? "Bearer " + appToken : "",
      },
    };
    const response = await axios.delete(url, headers);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data.message;
    } else if (error.request) {
      return error.request;
    } else {
      return error.message;
    }
  }
};
