import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";



import {
    placeOrder,
    getOrders,
    getOrderDetails,
    trackOrder,
    cancelOrder,
} from "../orders/order";



// ============================
// Place Order
// ============================

export const usePlaceOrder = () => {

    const queryClient = useQueryClient();


    return useMutation({

        mutationFn: placeOrder,


        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });


            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });

        },

    });

};




// ============================
// My Orders
// ============================

export const useOrders = (params = {}) => {


    return useQuery({

        queryKey: [
            "orders",
            params
        ],


        queryFn: () => getOrders(params),


        staleTime: 1000 * 60 * 5,

    });

};




// ============================
// Order Details
// ============================

export const useOrderDetails = (id) => {


    return useQuery({

        queryKey: [
            "order",
            id
        ],


        queryFn: () => getOrderDetails(id),


        enabled: !!id,


    });


};




// ============================
// Track Order
// ============================

export const useTrackOrder = (order_number) => {


    return useQuery({

        queryKey: [
            "trackOrder",
            order_number
        ],


        queryFn: () => trackOrder(order_number),


        enabled: !!order_number,


    });


};




// ============================
// Cancel Order
// ============================

export const useCancelOrder = () => {


    const queryClient = useQueryClient();


    return useMutation({


        mutationFn: cancelOrder,


        onSuccess: () => {


            queryClient.invalidateQueries({

                queryKey: ["orders"],

            });


        },


    });


};