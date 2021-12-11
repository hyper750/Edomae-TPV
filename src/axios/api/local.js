import { getApiWithLogin } from "../axios";

export default {
    ENDPOINT: '/local',

    async list(filters) {
        return await getApiWithLogin().get(this.ENDPOINT, { params: filters });
    },

    async post(local) {
        const { enabled, name, imatge } = local;

        const formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('name', name);
        formData.append('imatge', imatge, imatge.name);

        return await getApiWithLogin().post(this.ENDPOINT, formData);
    },

    async put(id, local) {
        const { enabled, name, imatge } = local;

        // TODO: Why is obligated to update the imatge?
        const formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('name', name);
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