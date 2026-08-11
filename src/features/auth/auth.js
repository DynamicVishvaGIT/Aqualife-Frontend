import axiosInstance from "../../api/axiosInstance";

export const sendLoginOtp = async (mobile) => {
  const { data } = await axiosInstance.post(
    "/auth/login/send-otp",
    { mobile }
  );

  console.log("sendLoginOtp:", data);

  return data;
};

export const verifyLoginOtp = async ({ mobile, otp }) => {
  const { data } = await axiosInstance.post(
    "/auth/login/verify-otp",
    { mobile, otp }
  );

  console.log("verifyLoginOtp:", data);

  // Backend:
  // {
  //   user: {...}
  // }
  // and sets httpOnly authentication cookie

  return data;
};

export const resendOtp = async (mobile) => {
  const { data } = await axiosInstance.post(
    "/auth/resend-otp",
    { mobile }
  );

  console.log("resendOtp:", data);

  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/auth/me");

  console.log("getCurrentUser:", data);

  return data.user;
};

export const updateProfile = async (payload) => {
  const { data } = await axiosInstance.put("/auth/profile", payload);
  console.log("updateProfile:", data);
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post(
    "/auth/logout"
  );

  console.log("logoutUser:", data);

  return data;
};