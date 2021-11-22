import axios from "axios";
import store from "../store";
import { BASE_URL } from "../settings";

export const api = axios.create({
    baseURL: BASE_URL
});


export const getApiWithLogin = () => {
    const token = store.getters.getToken;
    const loginAxios = axios.create({
        baseURL: BASE_URL,
        headers: { 'Authorization': `Bearer ${token}`}
    });

    return loginAxios;
};

