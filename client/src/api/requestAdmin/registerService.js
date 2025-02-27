import { api } from "../apiRest";
export const adduser = async (event) => {
    event.preventDefault();
    const nit = event.target.nit.value;  
    const rol = event.target.rol.value;
    const pass = event.target.pass.value;
    const passcon = event.target.passcon.value;
    try {
    const response = await api.post('/adduser/newUser', {
        nit, rol,
        pass, passcon
    });
    return response.data;
} catch (error) {
    return [];
}
};

