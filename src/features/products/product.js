import axiosInstance from "../../api/axiosInstance";

// Categories
export const getCategories = async () => {
  const { data } = await axiosInstance.get("/categories");
  return data;
};

// Products List
export const getProducts = async (params) => {
  const { data } = await axiosInstance.get("/products", {
    params,
  });

  return data;
};

// Filters
export const getProductFilters = async () => {
  const { data } = await axiosInstance.get("/products/filters");
  return data;
};

// Top Recommended
export const getTopRecommendedProducts = async () => {
  const { data } = await axiosInstance.get("/products/top-recommended");
  return data;
};

// New Launches
export const getNewLaunchProducts = async () => {
  const { data } = await axiosInstance.get("/products/new-launches");
  return data;
};

// Product by ID
export const getProductById = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
};

// Product by Slug
export const getProductBySlug = async (slug) => {
  const { data } = await axiosInstance.get(`/products/slug/${slug}`);
  return data;
};