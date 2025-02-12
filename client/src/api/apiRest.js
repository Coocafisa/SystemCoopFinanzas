import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let requestInterceptor;
let responseInterceptor;

export const useAxiosWithLoader = (
  setLoading,
  setAlert,
  setType,
  setInitAlert,
  timeout = 2000
) => {
  const removeInterceptors = () => {
    if (requestInterceptor !== undefined) {
      api.interceptors.request.eject(requestInterceptor);
      requestInterceptor = undefined;
    }
    if (responseInterceptor !== undefined) {
      api.interceptors.response.eject(responseInterceptor);
      responseInterceptor = undefined;
    }
  };
  removeInterceptors();
  requestInterceptor = api.interceptors.request.use(
    (config) => {
      setLoading(true);
      setInitAlert(true);
      delete config.headers.Authorization;
      const token = sessionStorage.getItem("token") || "";
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      setLoading(false);
      handleAlert(
        error.response?.data?.body?.message ||
          error ||
          "Error en la solicitud.",
        "error",
        timeout
      );
      return Promise.reject(error);
    }
  );

  responseInterceptor = api.interceptors.response.use(
    (response) => {
      setLoading(false);
      const newToken = response.headers["authorization"] || "";
      if (newToken) {
        sessionStorage.setItem("token", newToken);
      }
      const message = response.data?.body?.message || "";
      const redirect = response.data?.body?.redirect || "";
      handleAlert(message, "success", timeout, redirect);
      return response;
    },
    (error) => {
      setLoading(false);
      const errorMessage =
        error?.response?.data?.body?.message ||
        (error.message === "Network Error"
          ? "Solicitud rechazada. No se puede conectar al servidor."
          : "Error de red o servidor fuera de sevicio.");
      handleAlert(errorMessage, "error", timeout);
      return Promise.reject(error.response || error);
    }
  );

  const handleAlert = (message, type, duration, redirect) => {
    if (message) {
      setType(type);
      setAlert(message);
    }
    setTimeout(() => {
      setAlert("");
      setType("");
      setInitAlert(false);
      if (redirect) {
        window.location.href = redirect;
      }
    }, duration);
  };
};
