import { getApiWithLogin } from "../axios";

export default {
    ENDPOINT: '/meal',

    async list(filters) {
        return await getApiWithLogin().get(this.ENDPOINT, filters);
    },

    async post(meal) {
        const { enabled, name, description, price, category, order, imatge } = meal;

        const formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('order', order);
        formData.append('imatge', imatge, imatge.name);

        return await getApiWithLogin().post(this.ENDPOINT, formData);
    },

    async put(id, meal) {
        const { enabled, name, description, price, category, order, imatge } = meal;

        // TODO: Why is obligated to update the imatge?
        const formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('order', order);
        if (imatge) {
            formData.append('imatge', imatge, imatge.name);
        }

        return await getApiWithLogin().put(`${this.ENDPOINT}/${id}`, formData);
    },

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },

    async delete(id) {
        return await getApiWithLogin().delete(`${this.ENDPOINT}/${id}`);
    },
};