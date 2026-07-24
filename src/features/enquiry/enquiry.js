import axiosInstance from "../../api/axiosInstance";


// =================================
// Create Enquiry
// POST /enquiries
// Login NOT required
// =================================

export const createEnquiry = async (enquiryData) => {

  const { data } = await axiosInstance.post(
    "/enquiries",
    enquiryData
  );

  return data;
};



// =================================
// Get My Enquiries
// GET /enquiries
// Login required
// =================================

export const getMyEnquiries = async () => {

  const { data } = await axiosInstance.get(
    "/enquiries"
  );

  return data;
};