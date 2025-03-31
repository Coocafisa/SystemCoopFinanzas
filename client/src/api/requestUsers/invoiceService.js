import { api } from "../apiRest";
export const queryInvoices = async () => {
    try {
    const response = await api.get("/invoices");
    return response.data.body;
    } catch (error) {
        return [];
    }
};

export const queryinvoicepayment = async () => {
    try {
    const response = await api.get("/invoices/invoicesPayment");
    const data = response.data.body;
    return data
    } catch (error) {
        return []
    }
};

export const queryinvoicepending = async () => {
    try {
    const response = await api.get("/invoices/invoicesPending");
    return response.data.body
    } catch (error) {
        return []
    }
};