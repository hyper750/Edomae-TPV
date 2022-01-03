import { getApiWithLogin } from "../axios";

export default {
    ENDPOINT: '/ticket/command',

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },
};