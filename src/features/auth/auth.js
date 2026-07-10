import axiosInstance from "../../api/axiosInstance";
import Cookies from "js-cookie";

export const sendLoginOtp = async (mobile) => {
  const { data } = await axiosInstance.post("/auth/login/send-otp", { mobile });
  return data;
};

export const verifyLoginOtp = async ({ mobile, otp }) => {
  const { data } = await axiosInstance.post("/auth/login/verify-otp", { mobile, otp });
  // set token in cookies
    Cookies.set("token", data.token, {
    expires: 7,
    secure: true,
    sameSite: "Strict",
  });
  return data; // backend sets httpOnly cookie + returns { user }
}

export const resendOtp = async (mobile) => {
  const { data } = await axiosInstance.post("/auth/resend-otp", { mobile });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data; // { user }
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};