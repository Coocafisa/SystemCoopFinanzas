import { api } from "../apiRest";

export const emailValidate = async (event) => {
  event.preventDefault();
  const nit = event.target.nit.value.trim();
  try {
  await api.post("/auth/emailresetpass", { nit });
  } catch (error) {
    return [];
  }
};

export const resetpass = async (event) => {
  event.preventDefault();
  const newpass = event.target.newpass.value.trim();
  const confpass = event.target.confpass.value.trim();
  const token = new URLSearchParams(window.location.search).get("token");
  try {
  await api.post("/auth/resetpass", {
    newpass,
    confpass,
    token,
  });
  } catch (error) {
    return [];
  }
};

export const getToken = async () => {
  const token = new URLSearchParams(window.location.search).get("token");
  try {
  await api.get(`/auth/getToken?token=${token}`);
  } catch (error) {
    return [];
  }
};

export const verifyTokenAutoregister = async (setData) => {
  const token = new URLSearchParams(window.location.search).get("token");  
    try {
    const response = await api.get(`/userManagement/verifyTokenAutoregister?token=${token}`);
      const data = response.data.body;
      setData(data);
    } catch (error) {
        return [];
        }
};