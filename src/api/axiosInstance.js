import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bytealchemists.ue.r.appspot.com/",
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosInstance;
