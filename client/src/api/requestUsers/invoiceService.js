import { api } from "../apiRest";
export const queryInvoices = async () => {
  try {
    const response = await api.get("/invoices");
    const data = response.data.body;
    return data;
  } catch (error) {
    console.log("Error en la solicitud al servidor: ", error);
  }
};

export const queryinvoicepayment = async () => {
  try {
    const response = await api.get("/invoices/invoicesPayment");
    const data = response.data.body;
    return data;
  } catch (error) {
    console.log("Error en la solicitud al servidor: ", error);
  }
};

export const queryinvoicepending = async () => {
  try {
    const response = await api.get("/invoices/invoicesPending");
    const data = response.data?.body;
    console.log("Resultado de las consultas pendientes: ",data);
    return data;
  } catch (error) {
    console.log("Error en la solicitud al servidor: ", error);
  }
};
