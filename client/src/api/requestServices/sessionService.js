import { api } from "../apiRest";

export const getSession = async () => {
  try {
    const res = await api.get('/session');
    const sessionData = res.data;
    if (sessionData?.expiration) {
        const { minutes, seconds } = sessionData.expiration;
        return {
          ...sessionData,
          timeRemaining: {
            minutes,
            seconds,
          },
        };
      }
      return {
      isAuthenticated: false,
      user: null,
      role: null,
      expiration: null,
    };

  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      role: null,
      expiration: null,
    };
  }
};

export const dateUser = async () => {
  try {
    const response = await api.get('/users');
    const userData = response.data;
    return userData;
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      role: null,
      expiration: null,
    };
  }
};

export const sessionToken = async () => {
  try {
    if (sessionStorage.getItem("token")) {
      return sessionStorage.getItem("token");
    }
    return null;
  } catch (error) {
    return null;
  }
};

