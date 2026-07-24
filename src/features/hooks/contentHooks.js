import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";

import {
  getBlogs,
  getBlogDetails,
  getFaqs,
  submitContactForm,
} from "../content/content";


// =================================
// Blogs List
// Blogs Page
// =================================

export const useBlogs = () => {

  return useQuery({
    queryKey:[
      "blogs"
    ],
    queryFn:getBlogs,
    staleTime:
      1000 * 60 * 30,

  });

};




// =================================
// Blog Details
// Blog Details Page
// =================================

export const useBlogDetails = (slug) => {
  return useQuery({

    queryKey:[
      "blog",
      slug
    ],

    queryFn:()=>getBlogDetails(slug),
    enabled:!!slug,
    staleTime:
      1000 * 60 * 30,
  });

};




// =================================
// FAQs
// =================================

export const useFaqs = () => {

  return useQuery({

    queryKey:[
      "faqs"
    ],

    queryFn:getFaqs,
    staleTime:
      1000 * 60 * 60,
  });

};


// =================================
// Contact Form Submit
// =================================

export const useContactForm = () => {
  return useMutation({
    mutationFn:submitContactForm,
  });

};