import { api } from "../apiRest";

export const emailValidate = async (event, setAlert, setType, setLoading) => {
  event.preventDefault();
  const nit = event.target.nit.value.trim();
  if (nit === "") {
    setAlert("Nit es requerido");
    setType("alertMessage");
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    return;
  }

  try {
    const response = await api.post("/recoverypass/emailresetpass", { nit });
    const { data } = response;
    if (response.status === 200) {
      setType("success");
      setAlert(data.message);
      event.target.nit.value = "";
      setTimeout(() => {
        window.location.href = data.redirect;
        setLoading(false);
      }, 3000);
    }
  } catch (error) {
    setType("error");
    if (error.response) {
      const errorData = error.response.data.message;
      setAlert(errorData);
      if ([400, 401, 404].includes(error.response.status)) {
        setAlert(errorData);
      } else {
        setAlert("Error en el servidor. Intenta nuevamente más tarde.");
      }
    } else if (error.request) {
      setAlert(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
    } else {
      setAlert("Ocurrió un error al enviar la solicitud.");
    }
    setTimeout(() => {
      event.target.nit.value = "";
      setLoading(false);
    }, 5000);
  } finally {
    setTimeout(() => {
      event.target.nit.value = "";
      setLoading(false);
    }, 3000);
  }
};

export const resetpass = async (event, setAlert, token, setLoading, setType) => {
  const newpass = event.target.newpass.value.trim();
  const confpass = event.target.confpass.value.trim();
  try {
    const response = await api.post(`/recoverypass/resetpass`, {
      newpass,
      confpass,
      token,
    });
    const { data } = response;
    if (response.status === 201) {
      setAlert(data.message);
    }
    event.target.newpass.value = "";
    event.target.confpass.value = "";
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  } catch (error) {
    setType("error");
    if (error.response) {
      const errorData =
        error.response.data.errors || error.response.data.message;
      setAlert(errorData);
      if ([400, 401, 404].includes(error.response.status)) {
        setAlert(errorData);
      } else {
        setAlert("Error en el servidor. Intenta nuevamente más tarde.");
      }
      setTimeout(() => {
        event.target.newpass.value = "";
        event.target.confpass.value = ""; 
        setLoading(false);
        setAlert("");
      }, 2000);
    } else if (error.request) {
      setAlert(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
    } else {
      setAlert("Ocurrió un error al enviar la solicitud.");
    }
    setTimeout(() => {
      event.target.newpass.value = "";
      event.target.confpass.value = "";
      setLoading(false);
      setAlert("");
    }, 5000);
  }
};

export const getToken = async (setToken, setError, setType, setLoading) => {
  const token = new URLSearchParams(window.location.search).get("token");
  if (!token) {
    setType("error");
    setError("Token no proporcionado.");
    setTimeout(() => {
      window.location.href = "/";
      setLoading(false);
    }, 3000);
    return;
  }
  try {
    const response = await api.get(`/recoverypass/getToken?token=${token}`);
    const { data } = response;

    if (response.status === 200) {
      setType("success");
      setError(data.message);
      setToken(token);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      return true;
    }
  } catch (error) {
    setType("error");
    if (error.response) {
      if ([400].includes(response.status)) {
        const errorMessage =
          error.response?.data?.message || "Error de conexión";
        setError(errorMessage);
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/";
        }, 3000);
      } else {
        setError("Error en la solicitud al servidor.");
      }
    } else if (error.request) {
      setError(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
    } else {
      setError("Error en la solicitud al servidor.");
    }
    setTimeout(() => {
      setLoading(false);
      setError("");
    }, 5000);
  }
};
