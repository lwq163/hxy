import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import router from './modules/router'
import config from './modules/config'
import company from './modules/company'
import notice from './modules/notice'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        router,
        config,
        company,
        notice
    },
    getters
});

export default store