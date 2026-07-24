import axiosInstance from "../../api/axiosInstance";


// =================================
// Create Razorpay Order
// POST /payments/create-order
// =================================

export const createPaymentOrder = async ({ address_id }) => {

  const { data } = await axiosInstance.post(
    "/payments/create-order",
    {
      address_id,
    }
  );

  return data;
};



// =================================
// Verify Razorpay Payment
// POST /payments/verify
// =================================

export const verifyPayment = async (payload) => {

  const { data } = await axiosInstance.post(
    "/payments/verify",
    payload
  );

  return data;
};