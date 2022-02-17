import { getApiWithLogin } from "../axios";

export default {
    ENDPOINT: '/ticket/command',

    async list(filters) {
        return await getApiWithLogin().get(this.ENDPOINT, { params: filters });
    },

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },
};