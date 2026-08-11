import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://aqualife-backend-api.dvworks.in/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;