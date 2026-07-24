import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";



import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../cart/cart";



/* ============================
   Get Cart
============================ */

export const useCart = () => {

  return useQuery({

    queryKey: ["cart"],

    queryFn: getCart,

    staleTime: 1000 * 60 * 5,

  });

};



/* ============================
   Add To Cart
============================ */

export const useAddToCart = () => {

  const queryClient = useQueryClient();


  return useMutation({

    mutationFn: addToCart,


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey:["cart"],
      });

    },

  });

};




/* ============================
   Update Quantity
============================ */

export const useUpdateCartItem = () => {

  const queryClient = useQueryClient();


  return useMutation({

    mutationFn: updateCartItem,


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey:["cart"],
      });

    },

  });

};




/* ============================
   Remove Item
============================ */

export const useRemoveCartItem = () => {

  const queryClient = useQueryClient();


  return useMutation({

    mutationFn: removeCartItem,


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey:["cart"],
      });

    },

  });

};




/* ============================
   Clear Cart
============================ */

export const useClearCart = () => {

  const queryClient = useQueryClient();


  return useMutation({

    mutationFn: clearCart,


    onSuccess: () => {

      queryClient.removeQueries({
        queryKey:["cart"],
      });

    },

  });

};