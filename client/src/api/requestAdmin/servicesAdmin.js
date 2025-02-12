import { api } from "../apiRest";

export const programmatEmails = async (hora, minuto) => {
    try {
        const response = await api.post("/emails/scheduleMailings", {
            hour: Number(hora),
            minute: Number(minuto),
        });
        return response.data;
    } catch (error) {
        return error;
    } 
}

export const resendEmails = async () => {
    try {
        const response = await api.post("/emails/resendEmails");
        return response.data;
    } catch (error) {
        return error;
    } 
}