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
        return []
    }
};

export const queryEmails = async () => {
    try {
        const response = await api.get("/emails/sheduledEmails");
        const data = response.data;
        return data.body;
    } catch (error) {
        return []
    }
};

export const queryEmailsPending = async () => {
    try {
        const response = await api.get("/emails/sheduledEmailsPending");
        const data = response.data;
        return data.body;
    } catch (error) {
        return []
    }
}

export const timerEmails = async () => {
    try {
        const response = await api.get("/emails/timer");
        const data = response.data;
        if (response.status === 200) {
            return data.body;
        } else { 
            return { hour: 0, minute: 0 };
        }
    } catch (error) {
        return { hour: 0, minute: 0 };
    }
};