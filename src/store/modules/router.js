import store from '../../store'
import util from '_m/util'

export default {
    state: {
        menuList: [],
        asynRouter: [],
		menuIndex  : 0,
		secondList : []		
    },
    mutations: {
        SET_ROUTER (state,list) {
            state.menuList = list
        },
		SET_SECLIST (state,val){
			state.menuIndex  = val.index;
			state.secondList = val.data?val.data:'';
		}
    },
    actions: {
        GetLayout ({ commit, state }) {
            return new Promise((resolve, reject) => {
                let menuList = []
                let router = store.getters.get_asynRouter
                let roles = store.getters.get_roles
                let permissions = store.getters.get_permissions
                console.log('permissions',permissions)
                console.log('roles',roles)

                // 一级菜单
                for(let f in router) {
                    if(permissions.indexOf(router[f].meta.role) > -1 || router[f].meta.role == '*:*:*' || roles[0]=='admin') {
                        if(router[f].meta.isShow === true) {
                            let firstMenu = {
                                title: router[f].meta.title,
                                name: router[f].name,
                                path: router[f].path,
                                icon: router[f].meta.icon
                            }
                            if(router[f].hasOwnProperty('children') && router[f].children.length > 0) {
                                let firstMenuData = router[f].children
			                    firstMenu.children = []
                                // 二级菜单
                                for(let s in firstMenuData) {
                                    if(permissions.indexOf(firstMenuData[s].meta.role) > -1 || firstMenuData[s].meta.role == '*:*:*' || roles[0]=='admin') {
                                        if(firstMenuData[s].meta.isShow === true) {
                                            let secondMenu = {
                                                title: firstMenuData[s].meta.title,
                                                name: firstMenuData[s].name || firstMenuData[s].children[0].name,
                                                path: firstMenuData[s].path,
                                                icon: firstMenuData[s].meta.icon
                                            }
                                            if(firstMenuData[s].hasOwnProperty('children') && firstMenuData[s].children.length > 0) {
                                                let secondMenuData = firstMenuData[s].children
                                                secondMenu.children = []
                                                // 三级菜单
                                                for (let t in secondMenuData) {
                                                    if(permissions.indexOf(secondMenuData[t].meta.role) > -1 || secondMenuData[t].meta.role == '*:*:*' || roles[0]=='admin') {
                                                        if(secondMenuData[t].meta.isShow === true) {
                                                            let thirdMenu = {
                                                                title: secondMenuData[t].meta.title,
                                                                name: secondMenuData[t].name,
                                                                path: secondMenuData[t].path,
                                                                icon: secondMenuData[t].meta.icon
                                                            }
                                                            secondMenu.children.push(thirdMenu)
                                                        }
                                                    }
                                                }
                                            }
                                            firstMenu.children.push(secondMenu)
                                        }
                                    }
                                }
                            }
                            menuList.push(firstMenu)
                        }
                    }
                }
				util.setStorage('menuList',JSON.stringify(menuList))
                commit('SET_ROUTER', menuList)
                console.log('menuList',menuList)
            }).catch(err => {
                reject()
            })
        }
    }
}