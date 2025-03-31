const { api } = require("../apiRest");

async function updateRegister(updateFields, nit) {
    const renamedFields = (fields) => {
        const renameFields = {
            nit: 'identificacion',
            direccion: 'direcc',
            acceso: 'permits_id',
            estado: 'estado',
        };
        const newFields = {};
        for (const key in fields) {
            if (fields[key] !== "" && fields[key] !== null && fields[key] !== undefined) {
                const newKey = renameFields[key] || key;
                newFields[newKey] = fields[key];
            }
        }
        return newFields;
    }; 
    try {
    const response = await api.post("/generalService/updateRegister", {
        nit: nit,
        fields: renamedFields(updateFields)
    });
    return response;
    } catch (error) {
        return [];
    }
};

async function deleteRegister(nit, selectTable) {
    try {
      const response = await api.post("/generalService/deleteRegister", {
        nit: nit,
        selectTable: selectTable
      });
      return response.data;
    } catch (error) {
        return [];
    }
};

async function refreshToken () {
    try {
        const response = await api.get("/auth/refreshToken", {skipAlert: true});
        sessionStorage.setItem("token", response.data?.body.token);
        return response
    } catch (error) {
        return [];
    }
};

async function deletePermits(consec_permit) {
    try {
        const response = await api.post("/generalService/deletePermits", {
            consec_permit: consec_permit,
        });
        return response;
    } catch (error) {
        return [];
    }
};

export { updateRegister, deleteRegister, deletePermits, refreshToken };