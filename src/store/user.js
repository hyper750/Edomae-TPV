const state = {
    token: localStorage.getItem('token'),

    user: null,
};

const getters = {
    getToken(state) {
        return state.token;
    },

    getUser(state) {
        return state.user;
    },
};

const actions = {
    setToken({ commit }, token) {
        commit('mutateToken', token);

        if (token) {
            localStorage.setItem('token', token);
        }
        else {
            localStorage.removeItem('token');
        }
    },

    setUser({ commit }, user) {
        commit('mutateUser', user);
    }
};

const mutations = {
    mutateToken(state, token) {
        state.token = token;
    },

    mutateUser(state, user) {
        state.user = { ...user };
    },
};


export default {
    state,
    getters,
    actions,
    mutations
};
