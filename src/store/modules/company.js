import util from '_m/util'
import { getMasterDeptList,getMasterDeptInfo } from '_s'
export default {
    state: {
        deptList: [],
        isChanged: false,
        logo: '',
        info: null
    },
    mutations: {
        SET_DEPTLIST(state, data){
            state.deptList = data
        },
        CHANGE_DEPT(state, data){
            state.isChanged = data
        },
        SET_COMPANY_INFO (state, data) {
            state.info = data
        },
        SET_LOGO (state, data) {
            state.logo = data
        }
    },
    actions: {
        GetDeptList({commit}){
            return new Promise((resolve, reject) => {
                let params = {
                    isLogin: true
                }
                getMasterDeptList(params).then(res => {
                    if(res.code == 200){
                        let val = res.data
                        if(Object.prototype.toString.call(val)=='[object Array]' && val.length==1) {
                            util.setStorage('masterDeptId',val[0].masterDeptId)
                        }
                        commit('SET_DEPTLIST', val)
                        resolve(true)
                    }
                }).catch(err => {
                    reject(false)
                })
            })
        },
        changeDept({commit}){
            commit('CHANGE_DEPT', true)
        },
        GetCompanyInfo({commit}) {
            return new Promise((resolve, reject) => {
                let masterDeptId = parseInt(util.getStorage('masterDeptId'))
                getMasterDeptInfo(masterDeptId).then(res=>{
                    if(res.code===200) {
                        let val = res.data
                        commit('SET_COMPANY_INFO', val)
                        commit('SET_LOGO', val.logo)
                        resolve(res)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}