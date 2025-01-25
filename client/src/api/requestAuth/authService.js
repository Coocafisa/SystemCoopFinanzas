import { api } from "../apiRest";

export const auth = async (event) => {
  event.preventDefault();
  const user = event.target.user.value.trim();
  const password = event.target.password.value.trim();
   try {
  const res = await api.post("/auth", { user, password });
  const data = res.data;
    if (res.status === 200) {
      const token = data.body.token;
      sessionStorage.setItem("Token", token);
    }
  } catch (error) {
    console.log("Error en la autenticación: ", error);
  }
};