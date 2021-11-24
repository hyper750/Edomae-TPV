const state = {
    token: localStorage.getItem('token'),

    user: null,

    showError: false,

    error: null,
};

const getters = {
    getToken(state) {
        return state.token;
    },

    getUser(state) {
        return state.user;
    },

    getShowGlobalError(state) {
        return state.showError;
    },

    getGlobalError(state) {
        return state.error;
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
    },

    setShowGlobalError({ commit }, show) {
        commit('mutateShowError', show);
    },

    setGlobalError({ dispatch, commit }, error) {
        commit('mutateError', error);
        dispatch('setShowGlobalError', true);
    }
};

const mutations = {
    mutateToken(state, token) {
        state.token = token;
    },

    mutateUser(state, user) {
        state.user = { ...user };
    },

    mutateShowError(state, show) {
        state.showError = show;
    },

    mutateError(state, error) {
        state.error = error;
    }
};


export default {
    state,
    getters,
    actions,
    mutations
};
