import axiosInstance from "../../api/axiosInstance";


// ============================
// Place COD Order
// POST /orders
// ============================

export const placeOrder = async ({ address_id }) => {
  const { data } = await axiosInstance.post(
    "/orders",
    {
      address_id,
    }
  );

  return data;
};



// ============================
// Get My Orders
// GET /orders
// ============================

export const getOrders = async (params) => {

  const { data } = await axiosInstance.get(
    "/orders",
    {
      params,
    }
  );

  return data;
};



// ============================
// Single Order Details
// GET /orders/:id
// ============================

export const getOrderDetails = async (id) => {

  const { data } = await axiosInstance.get(
    `/orders/${id}`
  );

  return data;
};



// ============================
// Track Order
// GET /orders/track/:order_number
// ============================

export const trackOrder = async (order_number) => {

  const { data } = await axiosInstance.get(
    `/orders/track/${order_number}`
  );

  return data;
};



// ============================
// Cancel Order
// POST /orders/:id/cancel
// ============================

export const cancelOrder = async (id) => {

  const { data } = await axiosInstance.post(
    `/orders/${id}/cancel`
  );

  return data;
};