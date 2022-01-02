import { getApiWithLogin } from "../axios";
import AxiosHelper from "../helper";


export default {
    ENDPOINT: '/commandMeal',

    async list(filters) {
        return await getApiWithLogin().get(this.ENDPOINT, { params: filters });
    },

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },

    async post(commandMeal) {
        const { command, meal, number, extra, discount } = commandMeal;

        let formData = new FormData();
        formData.append('command', command);
        formData.append('meal', meal);
        formData.append('number', number);
        formData.append('extra', extra);
        formData.append('discount', discount);

        return await getApiWithLogin().post(this.ENDPOINT, formData);
    },

    async put(id, commandMeal) {
        const { command, meal, number, extra, discount } = commandMeal;

        let formData = new FormData();
        formData.append('command', command);
        formData.append('meal', meal);
        formData.append('number', number);
        formData.append('extra', extra);
        formData.append('discount', discount);
        formData = AxiosHelper.removeOptionalValues(formData);

        return await getApiWithLogin().put(`${this.ENDPOINT}/${id}`, formData);
    },

    async delete(id) {
        return await getApiWithLogin().delete(`${this.ENDPOINT}/${id}`);
    },
};