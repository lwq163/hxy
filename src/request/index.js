import axios from 'axios'
import {Message,Modal} from 'view-design'
import util from '_m/util'

// 创建axios实例
const fetch = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 15000 // 请求超时时间
})
const backHome = () => {
    util.delCookie('Admin-Token')
    localStorage.clear()
    setTimeout(() => {
        window.location.href = '/login'
    },500)
}

// 设置post请求头
fetch.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求前拦截器
fetch.interceptors.request.use(config => {
    // 接口添加Token
    if (util.isToken()===1) {
        config.headers['Authorization'] = 'Bearer ' + util.getCookie('Admin-Token')
    }
	// console.log(": " + JSON.stringify(config));
    return config
}, error => {
    return Promise.reject(error);
})

// 请求后拦截
fetch.interceptors.response.use(
    response => {
        let res = response.data
        if(res.code === 200) {
            return res
        }
        if(res.code === 401) {
            Modal.error({
                title: '提示',
                content: `${res.msg}，请点击“确定”返回系统首页！`,
                onOk: () => {
                    backHome()
                }
            })
            return Promise.reject(res.msg)
        }
        if (res.code === 500) {
            Message.error(res.msg)
            return Promise.reject(res.msg)
        }
        if ( res.code === -1) {
            Message.error(res.msg)
            return Promise.reject(res.msg)
        }
		else {
			Message.error(res.msg)
			return Promise.reject(res.msg)
		}
    },
    error => {
        if(error.message.includes('timeout')) {
            Modal.confirm({
                title: '错误',
                content: `网络超时，请刷新页面!`,
                okText: '刷新页面',
                cancelText: '返回首页',
                onOk: () => {
                    window.location.reload()
                },
                onCancel: () => {
                    backHome()
                }
            })
            return Promise.reject(error)
        }
        Message.error(error.toString())
        return Promise.reject(error)
    }
);
export default fetch;
