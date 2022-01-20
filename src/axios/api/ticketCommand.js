import { getApiWithLogin } from "../axios";

export default {
    ENDPOINT: '/ticket/command',

    async list() {
        return await getApiWithLogin().get(this.ENDPOINT);
    },

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },
};