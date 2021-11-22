import Vue from 'vue';
import Vuex from 'vuex';
import UserStore from './user';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        UserStore
    }
});

export default store;
