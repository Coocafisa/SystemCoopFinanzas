import { sessionToken } from '../authenticated/sessionService';

const api =  require('../apiRest');

export const logout = async (event,setAlert, setType, setLoading) => {
    event.preventDefault();
    try {
        const response = await api.post('/session/logout');
        const data = response.data;
        const session = sessionToken();
      if (session > 0 ) {
        setType("success");
        setAlert("Cerrramos sesión...");
        setTimeout(() => {
          setAlert("");
          window.location.href = "/";
          sessionStorage.removeItem("Token");
          setLoading(false);
        }, 1000);
      } else {
        setTimeout(() => {
            setAlert("Session Expirada.");
            window.location.href = "/";
            setLoading(false);
          }, 1000);
      }

    } catch (error) {
      setAlert("Error al cerrar sesión.");
      setTimeout(() => {
        setType("error");
        setAlert("");
        setLoading(false);
      }, 3000);
    }
  }