const { api } = require("../apiRest");

async function updateRegister(event, updateFields, nit) {
    event.preventDefault();
    const renamedFields = (fields) => {
        const renameFields = {
            identificacion: fields.nit,
            nombre: fields.nombre,
            usuario: fields.usuario,
            correo: fields.correo,
            telefono: fields.telefono,
            direcc: fields.direccion
        };
        const newFields = Object.keys(renameFields).reduce((acc, key) => {
            if (renameFields[key] !== "" && renameFields[key] !== null && renameFields[key] !== undefined) {
                acc[key] = renameFields[key];
            }
            return acc;
        }, {});
        return newFields;
    }; 
    try {
    const response = await api.post("/generalService/updateRegister", {
        nit: nit,
        fields: renamedFields(updateFields)
    });
    return response.data;
    } catch (error) {
        return [];
    }
}

async function deleteRegister(event, nit, selectTable) {
    event.preventDefault();
    try {
      const response = await api.post("/generalService/deleteRegister", {
        nit: nit,
        selectTable: selectTable
      });
    return response.data;
    } catch (error) {
        return [];
    }
  }

async function refreshToken () {
    try {
        const response = await api.post("/auth/refreshToken", {skipAlert: true});
        sessionStorage.setItem("token", response.data?.body.token);
        return response
    } catch (error) {
        return [];
    }
}

export { updateRegister, deleteRegister, refreshToken };