import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";



import {
    createEnquiry,
    getMyEnquiries,
} from "../enquiry/enquiry";



// =================================
// Create Enquiry
// Guest + Logged User
// =================================

export const useCreateEnquiry = () => {


    const queryClient = useQueryClient();


    return useMutation({

        mutationFn: createEnquiry,


        onSuccess: () => {


            queryClient.invalidateQueries({

                queryKey: ["enquiries"],

            });


        },


    });


};




// =================================
// My Enquiries
// Profile Page
// =================================

export const useMyEnquiries = () => {


    return useQuery({

        queryKey: ["enquiries"],


        queryFn: getMyEnquiries,


        staleTime: 1000 * 60 * 5,


    });


};