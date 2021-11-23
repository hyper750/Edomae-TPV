import { getApiWithLogin } from "../axios";

const MealCategory = {
    ENDPOINT: "/mealCategory",

    async list(filters) {
        return await getApiWithLogin().get(this.ENDPOINT, filters)
    },

    async post(mealCategory) {
        const { enabled, name, order, imatge } = mealCategory;
        const formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('name', name);
        formData.append('order', order);
        formData.append('imatge', imatge, imatge.name);
        return await getApiWithLogin().post(this.ENDPOINT, formData)
    },

    async get(id) {
        return await getApiWithLogin().get(`${this.ENDPOINT}/${id}`);
    },

    async put(id, mealCategoryData) {
        const { enabled, name, order, imatge } = mealCategoryData;
        const formData = new FormData();
        formData.append('enabled', enabled);
        formData.append('name', name);
        formData.append('order', order);
        // TODO: Why is obligated to update the imatge?
        // TODO: Update enabled is not working
        if (imatge) {
            formData.append('imatge', imatge, imatge.name);
        }

        return await getApiWithLogin().put(`${this.ENDPOINT}/${id}`, formData)
    },

    async delete(id) {
        return await getApiWithLogin().delete(`${this.ENDPOINT}/${id}`)
    }
};

export default MealCategory;