import { api } from "../apiRest";

export const getSession = async () => {
  try {
    const res = await api.get('/session', {skipAlert: true});
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
    return response.data;
  } catch (error) {
    return [];
  }
};