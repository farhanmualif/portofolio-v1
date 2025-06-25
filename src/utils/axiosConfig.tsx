import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://portofolio-api-roan.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tambahkan response interceptor untuk handle 401 dan refresh token otomatis
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        // Jika tidak ada refresh token, logout manual
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }
      try {
        const res = await axios.post(
          "https://portofolio-api-roan.vercel.app/api/auth/refresh-token",
          { refresh_token: refreshToken }
        );
        if (res.data.status) {
          localStorage.setItem("access_token", res.data.data.access_token);
          localStorage.setItem("refresh_token", res.data.data.refresh_token);
          axiosInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${res.data.data.access_token}`;
          processQueue(null, res.data.data.access_token);
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${res.data.data.access_token}`;
          return axiosInstance(originalRequest);
        } else {
          processQueue("Refresh token failed", null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
