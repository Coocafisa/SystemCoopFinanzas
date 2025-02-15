import { api } from '../apiRest';

export const logout = async () => {
    try {
        await api.post('/session/logout');
        const session = sessionStorage.getItem('token');
      if (session) {
        sessionStorage.removeItem('token');
      } 
      window.location.href = "/";
    } catch (error) {
      window.location.href = "/";
      return error;
    }
  }