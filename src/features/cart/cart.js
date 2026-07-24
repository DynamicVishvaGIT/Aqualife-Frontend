import axiosInstance from "../../api/axiosInstance";


// Get Cart Items + Totals
export const getCart = async () => {
  const { data } = await axiosInstance.get("/cart");

  return data;
};


// Add Product To Cart
export const addToCart = async ({
  product_id,
  qty,
}) => {
  const { data } = await axiosInstance.post(
    "/cart",
    {
      product_id,
      qty,
    }
  );

  return data;
};


// Update Cart Quantity
export const updateCartItem = async ({
  item_id,
  qty,
}) => {
  const { data } = await axiosInstance.put(
    `/cart/${item_id}`,
    {
      qty,
    }
  );

  return data;
};


// Remove Single Cart Item
export const removeCartItem = async (item_id) => {
  const { data } = await axiosInstance.delete(
    `/cart/${item_id}`
  );

  return data;
};


// Clear Entire Cart
export const clearCart = async () => {
  const { data } = await axiosInstance.delete(
    "/cart"
  );

  return data;
};