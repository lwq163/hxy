import fetch from '../../request'

// 获取未回款的合同编号
const listUnIncomeContract = () => fetch.get('/crm/contract/income/listUnIncomeContract')
// 获取列表批次信息
const listAdd = (data) => fetch.get('/crm/contract/income/listAdd', { params: data } )
// 新增合同回款
const add = (data) => fetch.post('/crm/contract/income/add', data )
// 合同回款列表
const list = (data) => fetch.get('/crm/contract/income/list', { params: data } )


// 获取未开票的合同号
// const listContract = () => fetch.get('/crm/contract/invoice/listContract')


// 申请开票、主动开票获取回款状态
const listUnInvoice = (data) => fetch.get('/crm/contract/invoice/listUnInvoice', { params: data } )
// 申请开票
const apply = (data) => fetch.post('/crm/contract/invoice/apply', data )
// 开票回款状态
const listApplyInvoice = (data) => fetch.get('/crm/contract/invoice/listApplyInvoice', { params: data } )
// 开票,主动开票保存
const invoiceAdd = (data) => fetch.post('/crm/contract/invoice/add', data )
// 发票作废
const invoiceCancel = (data) => fetch.post('/crm/contract/invoice/cancel', data )


// 获取当前企业下合同模板ID
const baseInfos = () => fetch.get('/system/contractTemplate/current/base-infos')
// 模糊查询报价单号
const codeList = (data) => fetch.get(`/crm/crm/contract/vague-search/code-list/${data}`)
// 根据报价单查询签约前基础信息
const service = (data) => fetch.get(`/crm/crm/contract/quotation/service/${data}`)
// 生成合同
const save = (data) => fetch.post('/crm/crm/contract/save', data )
// 合同列表
const contractList = (data) => fetch.get('/crm/crm/contract/list', { params: data } )
// 签约
const contractSign = (data) => fetch.post('/crm/crm/contract/sign', data )
// 归档(批量)
const pigeonhole = (data) => fetch.get(`/crm/crm/contract/pigeonhole/${data}`)
// 作废(批量)
const cancelled = (data) => fetch.get(`/crm/crm/contract/cancelled/${data}`)
// 借出(批量)
const lend = (data) => fetch.get(`/crm/crm/contract/lend/${data}`)
// 详情
const detail = (data) => fetch.get(`/crm/crm/contract/detail/${data}`)
// 修改
const update = (data) => fetch.post('/crm/crm/contract/update', data )
// 预览
const preview = (data) => fetch.get(`/crm/crm/contract/preview/${data}`)



export {
    listUnIncomeContract,
    listAdd,
    add,
    list,
    // listContract,
    listUnInvoice,
    apply,
    listApplyInvoice,
    invoiceAdd,
    invoiceCancel,
    baseInfos,
    codeList,
    service,
    save,
    contractList,
    contractSign,
    pigeonhole,
    cancelled,
    lend,
    detail,
    update,
    preview
}