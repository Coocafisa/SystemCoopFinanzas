import { api } from "../serverApi"

export const getPaymentsSuppliers = async () => {
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