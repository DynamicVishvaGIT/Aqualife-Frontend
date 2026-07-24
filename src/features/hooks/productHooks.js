import { useQuery } from "@tanstack/react-query";

import {
  getCategories,
  getProducts,
  getProductFilters,
  getTopRecommendedProducts,
  getNewLaunchProducts,
  getProductById,
  getProductBySlug,
} from "../products/product";

/* ============================
   Categories
============================ */

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

/* ============================
   Products Listing
============================ */

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/* ============================
   Product Filters
============================ */

export const useProductFilters = () => {
  return useQuery({
    queryKey: ["productFilters"],
    queryFn: getProductFilters,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

/* ============================
   Top Recommended Products
============================ */

export const useTopRecommendedProducts = () => {
  return useQuery({
    queryKey: ["topRecommendedProducts"],
    queryFn: getTopRecommendedProducts,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/* ============================
   New Launch Products
============================ */

export const useNewLaunchProducts = () => {
  return useQuery({
    queryKey: ["newLaunchProducts"],
    queryFn: getNewLaunchProducts,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/* ============================
   Product Details By ID
============================ */

export const useProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/* ============================
   Product Details By Slug
============================ */

export const useProductBySlug = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};