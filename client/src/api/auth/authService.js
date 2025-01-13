import { api } from "../apiRest";

export const auth = async (event, setAlert, setLoading, setType) => {
  event.preventDefault();
  const user = event.target.user.value.trim();
  const password = event.target.password.value.trim();

  try {
    const res = await api.post("/auth", { user, password });
    const data = res.data;
    if (res.status === 200) {
      setType("success");
      const token = data.body.token;
      sessionStorage.setItem("Token", token);
      setAlert("");
      setTimeout(() => {
        event.target.user.value = "";
        event.target.password.value = "";
        setLoading(false);
        window.location.href = data.body.redirect;
      }, 2000);
    }

  } catch (error) {
    setType("error");
  if (error.response) {
    const errorData = error.response.data.error || [400,401,403,404,500];
    setAlert(errorData ||"Credenciales incorrectas.");
  } else if (error.request) {
    setAlert("Nuestro servidor está fuera de servicio. Intenta más tarde.");
  } else {
    setAlert("Ocurrió un error al enviar la solicitud.");
  } 
} finally {
  setTimeout(() => {
    event.target.user.value = "";
    event.target.password.value = "";
    setAlert("");
    setType("");
    setLoading(false);
  }, 2000);
}
};