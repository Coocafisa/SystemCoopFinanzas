"use client"
import { api } from "../apiRest";

export const queryEmails = async (setError) => {
    try {
        const response = await api.get("/programmatemails/emails");
        const data = response.data;
        return data;
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data.error || error.response.data.errors;
            const errorRedirect = error.response?.data?.redirect;
            if ([400, 404, 403, 500].includes(error.response.status)) {
                setError(errorData);
                if (errorRedirect) window.location.href = errorRedirect;
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
        return [];
    }
} 

export const programmatEmails = async (hora, minuto, setAlert, setType, setLoading) => {
    try {
        setType('success');
        const response = await api.post("/shedulEmails/schedulEmailings", {
            hour:hora,
            minute:minuto,
        });
        const data = response.data;
        setAlert(data.message);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    } catch (error) {
        if (error.response) {
            setType('error');
            setAlert(error.response.data.message);
            setTimeout(() => {
                setLoading(false);
            }, 3000);
            return [];  
        } else if (error.request) {
            setAlert(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
          } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
          }
          setTimeout(() => {
            setLoading(false);
            setAlert("");
          }, 5000);
    }
}

export const timerEmails = async (setAlert) => {
    try {
        const response = await api.get("/emailsprogrammer/timer");
        const data = response.data;
        if(response.status === 200) {
            return data;
        } else {
            setAlert(data.message);
            return { hour: 0, minute: 0 };
        }
    } catch (error) {
        if (error.response) {
            setAlert(error.response.data.message);
            return { hour: 0, minute: 0 };
        } else if (error.request) {
            setAlert(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
              return { hour: 0, minute: 0 };
          } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
            return { hour: 0, minute: 0 };
          }
    }
}

export const getSuppliers = async (setAlert) => {
    try {
        const response = await api.get("/programmatemails/suppliers");
        const data = response.data;
        if (response.status === 200) {
            return data;
        } else {
            return [];
        }
    } catch (error) {
        if (error.response) {
            setAlert(error.response.data.error);
            return [];
        } else if (error.request) {
            setAlert(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
              return [];
          } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
            return [];
          }
    }
}

export const getPaymentsSuppliers = async (setAlert) => {
    try {
        const response = await api.get("/programmatemails/paymentsSuppliers");
        const data = response.data;
        if (response.status === 200) {
            return data;
        } else {
            return [];
        }
    } catch (error) {
        if (error.response) {
            setAlert(error.response.data.error);
            return [];
        } else if (error.request) {
            setAlert(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
              return [];
          } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
            return [];
          }
    }
}

export const getEmailsPending = async (setAlert) => {
    try {
        const response = await api.get("/programmatemails/pendingEmails");
        const data = response.data;
        if (response.status === 200) {
            return data;
        } else {
            setAlert(data.message);
            return [];
        }
    } catch (error) {
        if (error.response) {
            setAlert(error.response.data.message);
            return [];
        } else if (error.request) {
            setAlert(`Nuestro servidor está temporalmente fuera de servicio.
              Estamos haciendo todo lo posible para restablecer el servicio.
              Por favor, intenta más tarde.`);
              return [];
          } else { 
            setAlert("Ocurrió un error al enviar la solicitud.");
            return [];
          }
    }
}

export async function resendEmails(setMessage, setType, setLoading) {
    try {
        setType('success');
        const response = await api.post("/shedulEmails/resendEmails");
        const data = response.data;
        setMessage(data.message);
    } catch (error) {
        setType('error');
        if (error.response) {
            const errorData = error.response.data.message;
            if ([500].includes(error.response.status)) {
                setError(errorData);
            }
        } else if (error.request) {
            setError(`Nuestro servidor está temporalmente fuera de servicio.
                Estamos haciendo todo lo posible para restablecer el servicio.
                Por favor, intenta más tarde.`);
        } else {
            setError("Error en la solicitud al servidor.");
        }
        return [];
    }
    setTimeout(() => {
        setLoading(false);
        setMessage("");
    }, 2000);
}