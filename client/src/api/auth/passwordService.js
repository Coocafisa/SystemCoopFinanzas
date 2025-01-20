import { api } from "../apiRest";

const handleApiError = (error, setAlert) => {
  if (error.response) {
    const message = error.response.body || `Error desconocido (Código: ${error.response.status}).`;
    setAlert(message);
  } else if (error.request) {
    setAlert("Nuestro servidor está temporalmente fuera de servicio. Intenta más tarde.");
  } else {
    setAlert("Ocurrió un error al procesar la solicitud. Por favor, inténtalo nuevamente.");
  }
  setTimeout(()=> {
    setAlert("");
  }, 2000);
};


const redirectTo = (url, delay = 2000) => {
  setTimeout(() => {
    window.location.href = url;
  }, delay);
};

export const emailValidate = async (event, setAlert, setType, setLoading) => {
  event.preventDefault();
  const nit = event.target.nit.value.trim();

  if (!nit) {
    setAlert("Nit es requerido");
    setType("alertMessage");
    setLoading(false);
    return;
  }

  try {
    const { data, status } = await api.post("/recoverypass/emailresetpass", { nit });
    if (status === 200) {
      setType("success");
      setAlert(data.message);
      event.target.nit.value = "";
      redirectTo(data.redirect, 3000);
    }
  } catch (error) {
    setType("error");
    handleApiError(error, setAlert);
  } finally {
    setLoading(false);
  }
};

export const resetpass = async (event, setAlert, token, setLoading, setType) => {
  event.preventDefault();
  const newpass = event.target.newpass.value.trim();
  const confpass = event.target.confpass.value.trim();

  try {
    const { data, status } = await api.post("/recoverypass/resetpass", {
      newpass,
      confpass,
      token,
    });

    if (status === 201) {
      setAlert(data.message);
      redirectTo("/", 3000);
    }
  } catch (error) {
    setType("error");
    handleApiError(error, setAlert);
  } finally {
    event.target.newpass.value = "";
    event.target.confpass.value = "";
    setLoading(false);
  }
};

export const getToken = async (setToken, setError, setType, setLoading) => {
  const token = new URLSearchParams(window.location.search).get("token");

  if (!token) {
    setType("error");
    setError("Token no proporcionado.");
    redirectTo("/");
    return;
  }

  try {
    const { data, status } = await api.get(`/recoverypass/getToken?token=${token}`);
    if (status === 200) {
      setType("success");
      setError(data.message);
      setToken(token);
    }
  } catch (error) {
    setType("error");
    handleApiError(error, setError);
    redirectTo("/", 3000);
  } finally {
    setLoading(false);
  }
};

export const automaticRegistration = async (event, payload, setAlert, setType, setLoading) => {
  event.preventDefault();
  const { identificacion, rol, password, ter_cond } = payload;

  try {
    const { data, status } = await api.post("/userManagement/automaticRegistration", {
      identificacion,
      rol,
      password,
      ter_cond,
    });
    console.log("Respuesta del servidor: ", data);
    if (status === 200) {
      setType("success");
      setAlert(data.message);
      redirectTo("/");
    }
  } catch (error) {
    setType("error");
    handleApiError(error, setAlert);
  } finally {
    setLoading(false);
  }
};

export const verifyTokenAutoregister = async (setType, setAlert, setTokenValid, setData, setLoading) => {
  const token = new URLSearchParams(window.location.search).get("token");
  if (!token) {
    redirectTo("/");
    return;
  }

  try {
    const { data, status } = await api.get(`/userManagement/verifyTokenAutoregister?token=${token}`);
    if (status === 200) {
      const { body } = data;
      if (!body.name && !body.rol) {
        setType("error");
        setAlert("Token inválido, no se puede verificar la información.");
        setTokenValid(false);
        redirectTo("/");
        return;
      }

      setType("success");
      setTokenValid(true);
      setData(body);
      setAlert(body.message);
    }
  } catch (error) {
    setType("error");
    handleApiError(error, setAlert);
  } finally {
    setLoading(false);
  }
};