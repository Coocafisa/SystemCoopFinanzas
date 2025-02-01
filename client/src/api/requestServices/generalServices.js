const { api } = require("../apiRest");

async function updateRegister(event, updateFields, nit) {
    event.preventDefault();
    const renamedFields = (fields) => {
        console.log("Datos enviados: ", fields.direccion);
    }
    return renamedFields(updateFields);
    /* try {
        const response = await api.post("generalService/updateRegister",{
            nit: nit,
            fields: updateFields
        });
        const data = response.data.body;
        return data;
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
    } */
}

export { updateRegister };