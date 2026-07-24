import axiosInstance from "../../api/axiosInstance";


// =================================
// Get Downloads
// GET /downloads
//
// params examples:
// {}
// { type:"Manual" }
// { product_id:2 }
// =================================

export const getDownloads = async (params = {}) => {

  const { data } = await axiosInstance.get(
    "/downloads",
    {
      params,
    }
  );

  return data;
};