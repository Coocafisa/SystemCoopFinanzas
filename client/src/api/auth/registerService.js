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
        setType("success");
        setAlert(data.message);
        setTimeout(() => {
            setLoading(false);
            event.target.nit.value = '';
            event.target.rol.value = '';
            event.target.pass.value = '';
            event.target.passcon.value = '';
            window.location.href = data.redirect;
        }, 3000);
    } catch (error) {
        setType("error");
        if (error.response) {
            const errorData = error.response.data.message;
            const errorRedirect = error.response.data.redirect;
            if ([401, 400, 404, 500].includes(error.response.status)) {
                setAlert(errorData);
                setTimeout(() => {
                    if (errorRedirect) {
                        window.location.href = errorRedirect;
                    }
                }, 3000);
            } else {
                setAlert("Ocurrió un error al enviar la solicitud.");
            }
        } else if (error.request) {
            setAlert("No se recibió respuesta del servidor.");
        } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
        }
    } finally {
        setTimeout(() => {
            setAlert("");
            event.target.nit.value = '';
            event.target.rol.value = '';
            event.target.pass.value = '';
            event.target.passcon.value = '';
            setLoading(false);
        }, 3000);
    }
    
}
