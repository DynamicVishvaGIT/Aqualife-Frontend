import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    registerUser,
    sendLoginOtp,
    verifyLoginOtp,
    resendOtp,
    getCurrentUser,
    logoutUser,
} from "../auth";


// SIGNUP — logs in immediately, cookie set by backend
export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            queryClient.setQueryData(["currentUser"], data.user);
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
    });
};

// LOGIN step 1 — send OTP to mobile
export const useSendLoginOtp = () => {
    return useMutation({
        mutationFn: sendLoginOtp,
    });
};

// LOGIN step 2 — verify OTP, cookie set by backend
export const useVerifyOtp = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: verifyLoginOtp,
        onSuccess: (data) => {
            queryClient.setQueryData(["currentUser"], data.user);
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
    });
};

export const useResendOtp = () => {
    return useMutation({
        mutationFn: resendOtp,
    });
};

// Session check — powers AuthContext
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: 1000 * 60 * 5,
        select: (data) => data.user,
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.setQueryData(["currentUser"], null);
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            queryClient.clear();
        },
    });
};