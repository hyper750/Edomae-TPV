import { api, getApiWithLogin } from "../axios";

const User = {
    // TODO: Need to implement
    async register(user, password) {
        return await api.post("register", {
            user,
            password
        });
    },

    async login(username, password) {
        return await api.post("auth", {
            username,
            password
        })
    },

    async logout() {
        return await getApiWithLogin().delete('auth');
    },

    // TODO: Need to implement
    async changePassword(currentPassword, newPassword) {
        return await getApiWithLogin().post("changePassword", {
            currentPassword,
            newPassword
        });
    },

    async getUser() {
        return await getApiWithLogin().get('/user');
    },
};

export default User;
