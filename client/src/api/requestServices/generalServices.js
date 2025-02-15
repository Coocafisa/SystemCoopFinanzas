const { api } = require("../apiRest");

async function updateRegister(event, updateFields, nit) {
    event.preventDefault();
    const renamedFields = (fields) => {
        const renameFields = {
            ...fields,
            identificacion: fields.nit,
            nombre: fields.nombre,
            usuario: fields.usuario,
            correo: fields.correo,
            telefono: fields.telefono,
            tipo_entidad: fields.tipo_entidad,
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
        const response = await api.post("/generalService/updateRegister",{
            nit: nit,
            fields: renamedFields(updateFields)
        });
        const data = response.data;
        return data;
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
      return response;
    } catch (error) {
      return [];
    }
  }

async function refreshToken () {
    try {
        const response = await api.get("/auth/refreshToken", {skipAlert: true});
        const data = response.data;
        console.log("Datos de la sesión", data?.body.token);
        sessionStorage.setItem("token", data?.body.token);
        return data
    } catch (error) {
        return [];
    }
}
  

export { updateRegister, deleteRegister, refreshToken };