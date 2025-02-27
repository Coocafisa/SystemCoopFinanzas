import { api } from "../apiRest"

export const consultPaymentEntities = async () => {
    try {
        const response = await api.get('/admin');
            const formatedResults = response.data?.body;
            return formatedResults;
    } catch (error) {
        return [];
    }
};

export const queryEmails = async () => {
        try {
            const response = await api.get("/emails/sheduledEmails");
            return response.data?.body;
        } catch (error) {
            return [];
        }
};

export const queryEmailsPending = async () => {
        try {
            const response = await api.get("/emails/sheduledEmailsPending");
            return response.data?.body;    
        } catch (error) {
            return [];
        }
}

export const timerEmails = async () => {
        try {
            const response = await api.get("/emails/timer");
            return response.data?.body;
        } catch (error) {
            return { hour: 0, minute: 0 };
        }
};