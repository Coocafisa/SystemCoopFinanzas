import { api } from '../apiRest';
import { sessionToken } from '../requestServices/sessionService';

export const logout = async (event) => {
    event.preventDefault();
    try {
        await api.post('/session/logout');
        const session = sessionToken();
      if (session > 0 ) {
        setTimeout(() => {
          sessionStorage.removeItem("Token");
        }, 1000);
      } 
      window.location.href = "/";
    } catch (error) {
      console.log("Cierre de sessión fallido: ",error);
    }
  }