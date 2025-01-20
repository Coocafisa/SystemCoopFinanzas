import { api } from "../apiRest";
export const queryInvoices = async (setError) => {
  try {
    const response = await api.get("/queryIndex/invoices");
    const data = response.data;
    return data;
  } catch (error) {
    if (error.response) {
      const errorData =
        error.response.data.errors
      if ([401, 404].includes(error.response.status)) {
        setError(errorData);  
      } else {
        setError(
          "Error en la solicitud al servidor. Inténtalo de nuevo más tarde."
        );
      }
      return [];
    } else if (error.request) {
      setError(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
    } else {
      setError("Ocurrió un error al enviar la solicitud.");
    }
  }
};

export const queryinvoicepayment = async (setError) => {
  try {
    const response = await api.get("/queryIndex/invoicepayment");
    const data = response.data;
    return data;
  } catch (error) {
    if (error.response) {
      const errorData =
        error.response.data.errors || error.response.data.redirect;
      if ([401, 404].includes(error.response.status)) {
        setError(errorData);
      } else {
        setError(
          "Error en la solicitud al servidor. Inténtalo de nuevo más tarde."
        );
      }
      return [];
    } else if (error.request) {
      setError(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
    } else {
      setError("Ocurrió un error al enviar la solicitud.");
    }
  }
};

export const queryinvoicepending = async (setError) => {
  try {
    const response = await api.get("/queryIndex/invoicepending");
    const data = response.data;
    return data;
  } catch (error) {
    if (error.response) {
      const errorData =
        error.response.data.errors;
      if ([401, 404].includes(error.response.status)) {
        setError(errorData);
      } else {
        setError(
          "Error en la solicitud al servidor. Inténtalo de nuevo más tarde."
        );
      }
      return [];
    } else if (error.request) {
      setError(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
    } else {
      setError("Ocurrió un error al enviar la solicitud.");
    } return [];
  }
};
