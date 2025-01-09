import axios from "axios";

export const sessionToken = async () => {
  try {
    const token = sessionStorage.getItem("Token");
    console.log("Token actualizado:", token);
    return token ? token : null;
  } catch (error) {
    console.error("Error al obtener el token de sesión:", error);
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

/* api.interceptors.response.use(
  (response) => {
    if (response.data.body.token) {
    const token = response.data.body.token;
    sessionStorage.setItem("token", token);
    }
  }); */

api.interceptors.request.use(
  async (config) => {
    const token = await sessionToken();
    console.log("Token actualizado54:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
