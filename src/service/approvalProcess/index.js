import fetch from '../../request'

// 查询审批模板配置
const getApprovalTempList = (data) => fetch.get('/system/approvalTemp/list',{ params:data })

// 查询当前登录企业下所有人员
const getQueryCurrStaff = () => fetch.get('/system/user/queryCurrStaff')

// 获取企业/区域/部门/人员 
const getAllOrgStructure = (data) => fetch.get('/system/dept/query/getAllOrgStructure/' + data)

// 查看审批模板配置详情
const getApprovalTempDetail = (data) => fetch.get('/system/approvalTemp/getById',{ params:data })

// 修改crm审批模板
const postApprovalTempEdit = (data) => fetch.post('/system/approvalTemp/edit', data )


export {
    getApprovalTempList,
    getQueryCurrStaff,
    getAllOrgStructure,
    getApprovalTempDetail,
    postApprovalTempEdit
}