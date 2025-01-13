import { api } from "../apiRest";

export const queryUsers = async (setError) => {
    try {
        const response = await api.get("/queryusers/users");
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data.errors || error.response.data.error;
            setError(errorData)
        } else if (error.request) {
            setError("Error en la solicitud al servidor.")
        } else {
            setError("Error en el servidor.")
        }
        return[]
    }
}