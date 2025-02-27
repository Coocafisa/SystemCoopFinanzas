import { api } from "../apiRest";

export const programmatEmails = async (hora, minuto) => {
    try {
        const response = await api.post("/emails/scheduleMailings", {
            hour: Number(hora),
            minute: Number(minuto),
        });
        return response.data;
    } catch (error) {
        return [];   
    }
}

export const resendEmails = async () => {
    try {
    const response = await api.post("/emails/resendEmails", {}, { timeout: 20000 });
    return response.data;
    } catch (error) {
        return [];
    }
}

export const addPermit = async (data) => {
    try {
        const response = await api.post("/admin/permissions", {
            identificacion: data.identificacion, 
            permiso: data.acceso
        });
        return response.data;
    } catch (error) {
        return [];
    }
}