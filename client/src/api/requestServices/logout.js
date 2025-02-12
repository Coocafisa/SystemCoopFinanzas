import { api } from '../apiRest';

export const logout = async (event) => {
    event.preventDefault();
    try {
        await api.post('/session/logout');
        const session = sessionStorage.getItem('token');
      if (session) {
        sessionStorage.removeItem('token');
      } 
      window.location.href = "/";
    } catch (error) {
      return error;
    }
  }