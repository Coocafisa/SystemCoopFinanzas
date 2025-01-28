import { api } from "../apiRest";

export const programmatEmails = async (hora, minuto) => {
    try {
        const response = await api.post("/emails/scheduleMailings", {
            hour: Number(hora),
            minute: Number(minuto),
        });
        return response.data;
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
    } 
}

export const resendEmails = async (setMessage, setType, setLoading) => {
    try {
        const response = await api.post("/emails/resendEmails");
        return response.data;
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
    } 
}