import axios from "axios";

export const sessionToken = async () => {
  try {
    const token = sessionStorage.getItem("Token");
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
  if (!api.interceptors.request.handlers.length) {
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
        handleAlert(error.response?.data?.body?.message || error || "Error en la solicitud.", 'error', timeout);
        return Promise.reject(error);
      }
    );
  }

  if (!api.interceptors.response.handlers.length) {
    api.interceptors.response.use(
      (response) => {
        setLoading(false);
        const message = response.data?.body?.message || '';
        const redirect = response.data?.body?.redirect || '';
        handleAlert(message, 'success', timeout, redirect);
        return response;
      },
      (error) => {
        setLoading(false);
        if (error.message === 'Network Error' && error.code === 'ERR_NETWORK') {
          handleAlert('Solicitud rechazada. No se puede conectar al servidor.', 'error', timeout);
        } else if (error.response) {
          const errorMessage = error.response.data?.body?.message || "Error desconocido";
          handleAlert(errorMessage, 'error', timeout);
        } else {
          handleAlert('Error de red o servidor no disponible', 'error', timeout);
        }
        return Promise.reject(error.response || error);
      }
    );
  }

  const handleAlert = (message, type, duration, redirect) => {
    setInitAlert(true);
    if (message) {
      setType(type);
      setAlert(message);
    }
    setTimeout(() => {
      setAlert('');
      setType('');
      setInitAlert(false);
      if (redirect) {
        window.location.href = redirect;
      }
    }, duration);
  };
};
