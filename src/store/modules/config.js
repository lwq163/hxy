import { getSystemDict } from '_s'

export default {
    state: {
        config: null
    },
    mutations: {
        SET_CONFIG (state, data) {
            state.config = data
        }
    },
    actions: {
        GetConfig ({ commit }) {
            return new Promise((resolve, reject) => {
                getSystemDict().then(res => {
                    if(res.code===200) {
                        commit('SET_CONFIG', res.data)
                        resolve(res.data)
                    }
                })
            }).catch(err => {
                reject(err)
            })
        }
    }
}