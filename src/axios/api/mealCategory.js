import { getApiWithLogin } from "../axios";
import axiosHelper from "../helper";

const MealCategory = {
    ENDPOINT: "/mealCategory",

    async list(filters) {
        return await getApiWithLogin().get(this.ENDPOINT, { params: filters })
    },

    async post(mealCategory) {
        const { enabled, name, order, imatge } = mealCategory;
        let formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('name', name);
        formData.append('order', order);
        formData.append('imatge', imatge, imatge.name);
        formData = axiosHelper.removeOptionalValues(formData);
        return await getApiWithLogin().post(this.ENDPOINT, formData)
    },

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },

    async put(id, mealCategoryData) {
        const { enabled, name, order, imatge } = mealCategoryData;
        let formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('name', name);
        formData.append('order', order);
        if (imatge) {
            formData.append('imatge', imatge, imatge.name);
        }
        formData = axiosHelper.removeOptionalValues(formData);

        return await getApiWithLogin().put(`${this.ENDPOINT}/${id}`, formData)
    },

    async delete(id) {
        return await getApiWithLogin().delete(`${this.ENDPOINT}/${id}`)
    }
};

export default MealCategory;