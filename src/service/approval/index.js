import fetch from '../../request'

// 审批件查询 分页
const approvalDocumentList = (data) => fetch.get('/crm/approvalDocument/list', { params: data } )
// 根据id查询审批件详情
const approvalDocumentById = (data) => fetch.post('/crm/approvalDocument/getById', data )
// 审批操作 通过 或者 驳回
const approvalDocumentApproval = (data) => fetch.post('/crm/approvalDocument/approval', data )
// 报备任务
const approvalDocumentInfo = (params) => fetch.post(`/crm${params.path}`)
// 获取 crm 审批模板
const getCrmTemp = (data) => fetch.post('/crm/approvalDocument/getCrmTemp', data )

export {
    approvalDocumentList,
    approvalDocumentById,
    approvalDocumentApproval,
    approvalDocumentInfo,
    getCrmTemp
}