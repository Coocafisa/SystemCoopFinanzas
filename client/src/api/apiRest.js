import axios from "axios";
import { useRouter } from "next/navigation";

export const sessionToken = async () => {
  try {
    const token = sessionStorage.getItem("Token");
    console.log("Token de sesión: ", token);
    return token ? token : null;
  } catch (error) {
    return null;
  }
};

export const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const useAxiosWithLoader = (
  setLoading,
  setAlert,
  setType,
  setInitAlert,
  timeout = 2000
) => {
  api.interceptors.request.handlers = [];
  api.interceptors.response.handlers = [];
  const handleAlert = (message, type, duration, redirect) => {
    setAlert(message);
    setType(type);
    setInitAlert(true);
    
    setTimeout(() => {
      setAlert('');
      setType('');
      setInitAlert(false);
      if (redirect) {
        window.location.href = redirect;
      }
    }, duration);
  };

  api.interceptors.request.use(
    async (config) => {
      const token = await sessionToken();
      setLoading(true);
      setInitAlert(true);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      setLoading(false);
      handleAlert(error.response.data.body?.message || "Error en la solicitud.", 'error', timeout) ;
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      setTimeout(() => {
      setLoading(false);
      }, timeout);
      handleAlert(response.data.body?.message || '', '', timeout, response.data.body?.redirect);
      return response;
    },
    (error) => {
      console.log("Error de la solicitud24: ", error.response.data);
      setLoading(false);
      if (error.message === 'Network Error' && error.code === 'ECONNREFUSED') {
        handleAlert('Conexión rechazada. No se puede conectar al servidor.', 'error', timeout);
      } else if (error.response) {
        const errorMessage = error.response.data.body?.message || 'Error en la respuesta';
        handleAlert(errorMessage, 'error', timeout);
      } else {
        handleAlert('Error de red o servidor no disponible', 'error', timeout);
      }
      return Promise.reject(error.response.data || error);
    }
  );
};