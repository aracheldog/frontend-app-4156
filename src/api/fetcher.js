import axiosInstance from "./axiosInstance";

export const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);
