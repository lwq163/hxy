import { getUserInfo } from '_s/login'
import util from '_m/util'
import {asynRouter} from '../../router/router.list'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 */
 function filterAsyncRouter(asyncRouterMap, permissions) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if(permissions.indexOf(route.meta.role) > -1 || permissions[0] == '*:*:*' || route.meta.role=="*:*:*"){
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, permissions)
            }
            return true
        }
        return false
    })
    return accessedRouters
}

export default {
    state: {
        permissions: null,
        roles: [],
        userinfo: null,
        asynRouter: [],
        avatar: '',
        nickName: ''
    },
    mutations: {
        SET_PERMISSIONS (state, data) {
            state.permissions = data
        },
        SET_ROLES (state, data) {
            state.roles = data
        },
        SET_USER (state, data) {
            state.userinfo = data
        },
        SET_ASYNROUTER (state,list) {
            state.asynRouter = list
        },
        SET_AVATAR (state, data) {
            state.avatar = data
        },
        SET_NICKNAME (state, data) {
            state.nickName = data
        }
    },
    actions: {
        GetUser({ commit },info) {
            return new Promise((resolve, reject) => {
                let masterDeptId = parseInt(util.getStorage('masterDeptId'))
                getUserInfo(masterDeptId).then(res=>{
                    if(res.code===200) {
                        let permissions = res.permissions
                        let roles = res.roles.length===0?['guest']:res.roles
                        // 测试admin权限
                        // let permissions = ['*:*:*']
                        // let roles = ['admin']
                        let user = res.user
                        util.setStorage('userId',user.userId)
                        commit('SET_PERMISSIONS', permissions)
                        let filterRouter = filterAsyncRouter(asynRouter,permissions)
                        commit('SET_ASYNROUTER', filterRouter)
                        commit('SET_ROLES', roles)
                        commit('SET_USER', user)
                        commit('SET_AVATAR', user.avatar)
                        resolve(res)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        GetAvatar({commit},avatar) {
            commit('SET_AVATAR', avatar)
        },
        GetNickName({commit},nickName) {
            commit('SET_NICKNAME', nickName)
        }
    }
}