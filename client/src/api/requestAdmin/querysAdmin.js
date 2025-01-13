import { api } from "../apiRest"

export const consultPaymentEntities = async () => {
    try {
        const response = await api.get('/admin');
        const data = response.data;
        if (response.status === 200) {
            const formatedResults = data.body;
            return formatedResults;
        } else {
            return []
        }
    } catch (error) {
        if (error.response) {
            setAlert(error.response.data.error);
            return [];
        } else if (error.request) {
            setAlert(`Nuestro servidor está temporalmente fuera de servicio. Intenta mas tarde.`);
            return [];
        } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
            return [];
        }
    }
}

export const queryEmails = async (setError) => {
    try {
        const response = await api.get("/emails/sheduledEmails");
        const data = response.data;
        return data.body;
    } catch (error) {
        if (error.response) {
            setError(response.data.body.message);
            return [];
        } else if (error.request) {
            setError(`Nuestro servidor está temporalmente fuera de servicio. Intenta mas tarde.`);
            return [];
        } else {
            setError("Ocurrió un error al enviar la solicitud.");
            return [];
        }
    }
}

export const queryEmailsPending = async (setAlert) => {
    try {
        const response = await api.get("/emails/sheduledEmailsPending");
        const data = response.data;
        return data.body;
    } catch (error) {
        if (error.response) {
            setAlert("Error en la solicitud: ", error);
            return [];
        } else if (error.request) {
            setAlert(`Nuestro servidor está temporalmente fuera de servicio. Intenta mas tarde.`);
            return [];
        } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
            return [];
        }   
    }
}

export const timerEmails = async (setAlert) => {
    try {
        const response = await api.get("/emails/timer");
        const data = response.data;
        if (response.status === 200) {
            return data.body;
        } else { 
            setAlert(data.body.message);
            return { hour: 0, minute: 0 };
        }
    } catch (error) {
        if (error.response) {
            setAlert(error.response.data.body.message);
            return { hour: 0, minute: 0 };
        } else if (error.request) {
            setAlert(`Nuestro servidor está temporalmente fuera de servicio. Intenta mas tarde.`);
            return { hour: 0, minute: 0 };
        } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
            return { hour: 0, minute: 0 };
        }
    }
}