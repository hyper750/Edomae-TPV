import { getApiWithLogin } from "../axios";

export default {
    ENDPOINT: '/print/command',

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },
};