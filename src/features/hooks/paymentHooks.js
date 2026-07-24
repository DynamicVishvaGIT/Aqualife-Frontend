import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import {
  createPaymentOrder,
  verifyPayment,
} from "../payment/payment";



// =================================
// Create Razorpay Order Hook
// =================================

export const useCreatePaymentOrder = () => {


  return useMutation({

    mutationFn: createPaymentOrder,

  });


};




// =================================
// Verify Payment Hook
// =================================

export const useVerifyPayment = () => {


  const queryClient = useQueryClient();


  return useMutation({

    mutationFn: verifyPayment,


    onSuccess:()=>{


      // refresh orders

      queryClient.invalidateQueries({
        queryKey:["orders"],
      });


      // cart empty after successful payment

      queryClient.invalidateQueries({
        queryKey:["cart"],
      });


    },


  });


};