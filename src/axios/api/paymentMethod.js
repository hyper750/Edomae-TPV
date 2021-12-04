import { getApiWithLogin } from "../axios";


export default {
    ENDPOINT: '/paymentMethod',

    async list() {
        return await getApiWithLogin().get(this.ENDPOINT);
    },

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },

    async post(paymentMethod) {
        const { enabled, name } = paymentMethod;
        const formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('name', name);

        return await getApiWithLogin().post(this.ENDPOINT, formData);
    },

    async put(id, paymentMethod) {
        const { enabled, name } = paymentMethod;
        const formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('name', name);

        return await getApiWithLogin().put(`${this.ENDPOINT}/${id}`, formData);
    },

    async delete(id) {
        return await getApiWithLogin().delete(`${this.ENDPOINT}/${id}`);
    },
};