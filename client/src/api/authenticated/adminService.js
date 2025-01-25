"use client"
import { api } from "../apiRest";

export const queryEmails = async () => {
    try {
        const response = await api.get("/programmatemails/emails");
        const data = response.data;
        return data;
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
        return [];
    }
} 

export const programmatEmails = async (hora, minuto) => {
    try {
        const response = await api.post("/shedulEmails/schedulEmailings", {
            hour:hora,
            minute:minuto,
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
    }
}

export const timerEmails = async () => {
    try {
        const response = await api.get("/emailsprogrammer/timer");
        const data = response.data;
        if(response.status === 200) {
            return data;
        } else {
            return { hour: 0, minute: 0 };
        }
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
        return { hour: 0, minute: 0 };
    }
}

export const getSuppliers = async () => {
    try {
        const response = await api.get("/programmatemails/suppliers");
        const data = response.data;
        return data;
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
        return [];
    }
}

export const getPaymentsSuppliers = async () => {
    try {
        const response = await api.get("/programmatemails/paymentsSuppliers");
        const data = response.data;
        return data;
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
        return [];
    }
}

export const getEmailsPending = async () => {
    try {
        const response = await api.get("/programmatemails/pendingEmails");
        const data = response.data;
        return data;
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
        return [];
    }
}

export async function resendEmails() {
    try {
        const response = await api.post("/shedulEmails/resendEmails");
        return response.data;
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
        return [];
    }
}