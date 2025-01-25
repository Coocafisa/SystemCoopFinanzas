import { api } from "../apiRest";
export const adduser = async (event, setAlert, setType, setLoading) => {
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
        const data = response.data;
        setTimeout(() => {
            event.target.nit.value = '';
            event.target.rol.value = '';
            event.target.pass.value = '';
            event.target.passcon.value = '';
            window.location.href = data.redirect;
        }, 3000);
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);  
    } 
};

