import { api } from "../apiRest";

export const auth = async (event, setData) => {
  event.preventDefault();
  const user = event.target.user.value.trim();
  const password = event.target.password.value.trim();
  try {
  const res = await api.post("/auth", { user, password });
  const token = res.data?.body?.token;
  sessionStorage.setItem("token", token);
  } catch (error) {
      return [];
  }
};