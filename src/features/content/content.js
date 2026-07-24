import axiosInstance from "../../api/axiosInstance";


// =================================
// Get Blogs
// GET /blogs
// =================================

export const getBlogs = async () => {

  const { data } = await axiosInstance.get(
    "/blogs"
  );

  return data;
};



// =================================
// Get Blog Details
// GET /blogs/:slug
// =================================

export const getBlogDetails = async (slug) => {

  const { data } = await axiosInstance.get(
    `/blogs/${slug}`
  );

  return data;
};



// =================================
// Get FAQs
// GET /faqs
// =================================

export const getFaqs = async () => {

  const { data } = await axiosInstance.get(
    "/faqs"
  );

  return data;
};



// =================================
// Contact Form
// POST /contact
// =================================

export const submitContactForm = async (formData) => {

  const { data } = await axiosInstance.post(
    "/contact",
    formData
  );

  return data;
};