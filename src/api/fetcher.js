import axiosInstance from "./axiosInstance";

export const fetcher = (url) =>
  axiosInstance.get(url).then((res) => {
    if (url === "/services/categories") {
      let categories = res.split(",");
      let categoriesObject = categories.map((category, idx) => {
        return { id: idx, category_name: category };
      });
      return categoriesObject;
    }

    return res; // 返回实际数据
  });
