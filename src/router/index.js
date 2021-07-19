import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {routePage} from './router.list'
import util from '_m/util'
import store from '../store'
import {Modal} from 'view-design'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    routes: routePage
})
const whiteList = ['/login','/resetPwd','/register']

//路由守卫
router.beforeEach((to, from, next) => {
    NProgress.start()
    let pathArr = to.path.split('/')

    const switchPath = () => {
        switch(pathArr[1]){
            case 'login':
                if (store.getters.get_roles.length === 0) {
                    if(store.state.company.deptList.length > 1) {
                        next('/chooseEnterprise')
                    }else {
                        next('/index')
                    }
                }else {
                    next()
                }
                break;
            case 'chooseEnterprise':
                if (store.getters.get_roles.length === 0) {
                    if(store.state.company.deptList.length == 1) {
                        next('/index')
                    }else {
                        if(util.getStorage('masterDeptId')) {
                            next('/index')
                        }else {
                            next()
                        }
                    }
                }else {
                    next()
                }
                break;
            default:
                if (store.getters.get_roles.length === 0){
                    // 判断当前用户是否已拉取完user_info信息
                    store.dispatch('GetUser').then(res => {
                        if(res.code===200) {
                            // 路由二级三级菜单
                            store.dispatch('GetLayout')
                            // 公司信息
                            store.dispatch('GetCompanyInfo')
                            // 配置文件字典等
                            store.dispatch('GetConfig').then(a => {
                                router.addRoutes(store.getters.get_asynRouter) // 动态添加可访问路由表
                                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
                            })
                        }
                    }).catch(err=>{
                        console.log(err)
                        Modal.error({
                            title: '错误',
                            content: '该企业不存在，请点击“确定”重新登录！',
                            okText: '确定',
                            onOk: () => {
                                util.delCookie('Admin-Token')
                                localStorage.clear()
                                next('/login')
                                window.location.reload()
                            }
                        })
                    })
                } else {
                    next()
                }
            break;
        }
    }

    const validateRouter = () =>{
        if(store.state.company.deptList.length === 0){
            store.dispatch('GetDeptList').then(res => {
                if(res){
                    switchPath()
                } else {
                    next('/chooseEnterprise')
                }
            }).catch((err) => {
                // util.delCookie('Admin-Token')
                // localStorage.clear()
                // next('/login')
                // window.location.reload()
            });
        } else {
            switchPath()
        }
    }

    switch(util.isToken()) {
        case 0:
            if (whiteList.indexOf(to.path) !== -1) {
                // 在免登录白名单，直接进入
                next()
            } else {
                next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
                NProgress.done()
            }
            break;
        case 1:
            validateRouter()
            break;
    }
})

router.afterEach(() => {
    NProgress.done()
})

export default router