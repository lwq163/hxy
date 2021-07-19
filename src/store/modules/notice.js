export default {
    state: {
        isRead: false
    },
    mutations: {
        SET_ISREAD (state, data) {
            state.isRead = data
        }
    },
    actions: {
        GetIsRead ({ commit },data) {
            console.log('data',data)
            commit('SET_ISREAD', data)
        }
    }
}