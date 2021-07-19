import fetch from '../../request'

// 登录操作
const postLogin = (data) => fetch.post('/auth/login',data)
// 获取验证码
const getCodeImg = () => fetch.get('/code')
// 获取用户详细信息
const getUserInfo = (data) => fetch.get('/system/user/getInfo/' + data)
// 登出
const deleteLogout = () => fetch.delete('/auth/logout')
// 校验邮箱是否可用
const checkEmail = (data) => fetch.post('/system/user/checkEmail', data)
// 发送邮件验证码
const sendAuthCode = (data) => fetch.post('/system/email/sendAuthCode', data)
// 用户注册
const signIn = (data) => fetch.post('/system/user/signIn', data)
// 重置密码
const reset = (data) => fetch.post('/system/user/reset', data)

export {
    postLogin,
    getCodeImg,
    getUserInfo,
    deleteLogout,
    checkEmail,
    sendAuthCode,
    signIn,
    reset
}