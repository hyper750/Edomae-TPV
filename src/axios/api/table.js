import { getApiWithLogin } from "../axios";

export default {
    ENDPOINT: "/table",

    async list(filters) {
        return await getApiWithLogin().get(this.ENDPOINT, { params: filters })
    },

    async post(table) {
        const { enabled, number, local, number_of_persons, x_coordinates, y_coordinates } = table;

        const formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('number', number);
        formData.append('local', local);
        formData.append('number_of_persons', number_of_persons);
        formData.append('x_coordinates', x_coordinates);
        formData.append('y_coordinates', y_coordinates);
        
        return await getApiWithLogin().post(this.ENDPOINT, formData)
    },

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },

    async put(id, table) {
        const { enabled, number, local, number_of_persons, x_coordinates, y_coordinates } = table;
        
        const formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('number', number);
        formData.append('local', local);
        formData.append('number_of_persons', number_of_persons);
        if(x_coordinates) {
            formData.append('x_coordinates', x_coordinates);
        }
        if(y_coordinates) {
            formData.append('y_coordinates', y_coordinates);
        }

        return await getApiWithLogin().put(`${this.ENDPOINT}/${id}`, formData)
    },

    async delete(id) {
        return await getApiWithLogin().delete(`${this.ENDPOINT}/${id}`)
    }
};