import { api } from "../apiRest";

export const queryUsers = async () => {
    try {
        const response = await api.get("/users/queryusers");
        return response.data.body;
    } catch (error) {
        return[]
    }
}

export const queryEntities = async () => {
    try {
        const response = await api.get("/users/entities");
        return response.data.body;
    } catch (error) {
        return[]
    }
}