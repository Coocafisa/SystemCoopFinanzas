import { api } from "../apiRest";

export const programmatEmails = async (hora, minuto, setAlert, setType, setLoading) => {
    try {
        setType('success');
        const response = await api.post("/emails/sheduleMailings", {
            hour: hora,
            minute: minuto,
        });
        const data = response.data;
        setAlert(data.body.message);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    } catch (error) {
        if (error.response) {
            setType('error');
            setAlert(error.response.data.body.message);
            return [];
        } else if (error.request) {
            setAlert('Servidor Fuera de servicio. Intenta mas tarde.');
            return [];
        } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
            return [];
        } 
    } finally {
        setTimeout(() => {
            setAlert("");
            setType("");
            setLoading(false);
        }, 2000);
    }
}

export const resendEmails = async (setMessage, setType, setLoading) => {
    try {
        setType('success');
        const response = await api.post("/emails/resendEmails");
        const data = response.data;
        setMessage(data.body.message);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    } catch (error) {
        if (error.response) {
            setType('error');
            setAlert(error.response.data.body.message);
            return [];
        } else if (error.request) {
            setAlert('Servidor Fuera de servicio. Intenta mas tarde.');
            return [];
        } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
            return [];
        } 
    } finally {
        setTimeout(() => {
            setAlert("");
            setType("");
            setLoading(false);
        }, 2000);
    }
}