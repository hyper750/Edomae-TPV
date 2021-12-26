import { getApiWithLogin } from "../axios";
import AxiosHelper from "../helper";


export default {
    ENDPOINT: '/command',

    async list(filters) {
        return await getApiWithLogin().get(this.ENDPOINT, { params: filters });
    },

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },

    async post(command) {
        const { table, table_name, is_home_delivery, delivery_address, discount, extra } = command;

        let formData = new FormData();
        formData.append('table', table);
        formData.append('table_name', table_name);
        formData.append('is_home_delivery', is_home_delivery);
        formData.append('delivery_address', delivery_address);
        formData.append('discount', discount);
        formData.append('extra', extra);
        formData = AxiosHelper.removeOptionalValues(formData);

        return await getApiWithLogin().post(this.ENDPOINT, formData);
    },

    async put(id, command) {
        const { table, table_name, is_home_delivery, delivery_address, discount, extra, paid, payment_method } = command;

        let formData = new FormData();
        formData.append('table', table);
        formData.append('table_name', table_name);
        formData.append('is_home_delivery', is_home_delivery);
        formData.append('delivery_address', delivery_address);
        formData.append('discount', discount);
        formData.append('extra', extra);
        formData.append('paid', paid);
        formData.append('payment_method', payment_method);
        formData = AxiosHelper.removeOptionalValues(formData);

        return await getApiWithLogin().put(`${this.ENDPOINT}/${id}`, formData);
    },

    async delete(id) {
        return await getApiWithLogin().delete(`${this.ENDPOINT}/${id}`);
    },
};