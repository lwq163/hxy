import fetch from '../../request'
import Qs from 'qs'

// 查询当前登录人个人信息
const getBasicInfo = () => fetch.get('/system/user/basicInfo')
// 校验邮箱是否已注册
const getCheckEmail = (data) => fetch.get('/system/user/checkEmail', { params:data })
// 修改密码
const postModifyPwd = (data) => fetch.post('/system/user/modifyPwd', data)
// 个人设置-基本设置保存
const postUpdateInfo = (data) => fetch.post('/system/user/updateBasicInfo', data)
// 上传头像
const postUserAvatar = (data) => fetch.post('/system/user/avatar', data)

export {
    getBasicInfo,
    getCheckEmail,
    postModifyPwd,
    postUpdateInfo,
    postUserAvatar
}