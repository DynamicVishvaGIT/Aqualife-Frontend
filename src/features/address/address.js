import axiosInstance from "../../api/axiosInstance";

// Get all addresses
export const getAddresses = async () => {
  const { data } = await axiosInstance.get("/addresses");
  return data;
};

// Add new address
export const addAddress = async (addressData) => {
  const { data } = await axiosInstance.post("/addresses", addressData);
  return data;
};

// Update address
export const updateAddress = async ({ id, addressData }) => {
  const { data } = await axiosInstance.put(
    `/addresses/${id}`,
    addressData
  );

  return data;
};

// Delete address
export const deleteAddress = async (id) => {
  const { data } = await axiosInstance.delete(`/addresses/${id}`);
  return data;
};

// Make default address
export const makeDefaultAddress = async (id) => {
  const { data } = await axiosInstance.post(
    `/addresses/${id}/default`
  );

  return data;
};