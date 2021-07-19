import fetch from '../../request'

// 保存企业基本信息
const postEditCompany = (data) => fetch.post('/system/company/edit', data)
// 解散企业
const getDissolution = (data) => fetch.get('/system/dept/dissolutionOfTheEnterprise',{ params:data })
// 查询当前登录企业下所有人员
const getQueryCurrStaff = () => fetch.get('/system/user/queryCurrStaff')
// 转让企业创建人身份
const getTransferMasterAdmin = (data) => fetch.get('/system/role/transferMasterAdmin', { params:data })

export {
    postEditCompany,
    getDissolution,
    getQueryCurrStaff,
    getTransferMasterAdmin
}