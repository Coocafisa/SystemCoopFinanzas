import { api } from "../apiRest";

export const queryUsers = async () => {
    try {
        const response = await api.get("/users/queryusers");
        console.log("Usuarios: ", response.data)
        return response.data.body;
    } catch (error) {
        console.log("Error en la solicitud al servidor: ", error);
        return[]
    }
}