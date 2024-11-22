import axiosInstance from "./axiosInstance";

export const getService = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params });
    return response;
  } catch (error) {
    console.error("Error in getService:", error);
    throw error;
  }
};

export const postService = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response;
  } catch (error) {
    console.error("Error in postService:", error);
    throw error;
  }
};

export const putService = async (url, data) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response;
  } catch (error) {
    console.error("Error in putService:", error);
    throw error;
  }
};

export const deleteService = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response;
  } catch (error) {
    console.error("Error in deleteService:", error);
    throw error;
  }
};
