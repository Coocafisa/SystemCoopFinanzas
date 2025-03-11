import axios from "axios";
import { useEffect } from "react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 40000,
});

let requestInterceptor;
let responseInterceptor;

export const useAxiosWithLoader = (
  setLoading,
  setAlert,
  setType,
  setInitAlert,
  setData,
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
      if (!config.skipAlert) {
        setLoading(true);
        setInitAlert(true);
      }
      delete config.headers.Authorization;
      const token = sessionStorage.getItem("token") || "";
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return {...config}
    },
    (error) => {
      setLoading(false);
      handleAlert(
        error.response?.data?.body?.message || error || "Error en la solicitud.",
        "error",
        timeout
      );
      return Promise.reject(error);
    }
  );

  responseInterceptor = api.interceptors.response.use(
    (response) => {
      if (!response.config?.skipAlert) {
        const message = response.data?.body?.message || "";
        if (message) {
          setLoading(false);
        }
        const redirect = response.data?.body?.redirect || "";
        handleAlert(message, "success", timeout, redirect);
      }
      return response;
    },
    (error) => {
      setLoading(false);
      const errorRedirect = error?.response?.data?.body?.redirect;
      const errorMessage = error?.response?.data?.body?.message ||
        (error.message === "Network Error"
          ? "No se pudo conectar al servidor. Verifica tu conexión."
          : error.response?.status === 4001
          ? "No autorizado. Por favor, inicia sesión de nuevo."
          : "Error inesperado en la red o servidor.");
      if (error.response?.data?.body?.resetSession) {
        setData(error.response?.data?.body?.resetSession);
      }
      handleAlert(errorMessage, "error", 3000, errorRedirect);
      return Promise.reject(error);
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
     if (redirect) {
        window.location.href = redirect;
      }
      setInitAlert(false);
    }, duration);
  };

  useEffect(() => {
    return () => removeInterceptors();
  }, []);
};
