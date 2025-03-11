import { api } from "../apiRest";
export const adduser = async (formValues) => {
    try {
    const response = await api.post('/userManagement/addUsers', {
        identificacion: formValues.nit,
        rol: formValues.rol
    });
    return response.data;
} catch (error) {
    return [];
}
};

export const addEntity = async (payload) => {
    try {
        const response = await api.post('/userManagement/addEntity', {
            identificacion: payload.nit,
            nombre: payload.nombre,
            correo: payload.correo
        });
        return response.data;
    } catch (error) {
        return [];
    }
};

export const automaticRegistration = async (event, payload) => {
    event.preventDefault();
    const { identificacion, rol, password, ter_cond } = payload;
    try {
      await api.post("/userManagement/automaticRegistration", {
        identificacion,
        rol,
        password,
        ter_cond,
      });
      } catch (error) {
        return [];
      }
  };

