import fetch from '../../request'

// 新增回款
const incomeAdd = (data) => fetch.post('/crm/contract/income/add', data)
// 合同编号
const getContractByCustomerId = (data) => fetch.get(`/crm/contract/getDetailByCustomerId/${data}` )
// 客户回访中获取合同
const contractByCustomerId = (data) => fetch.get(`/crm/crm/contract/getContractByCustomerId/${data}` )
// 合同所属人
const getDetailByContractNo = (data) => fetch.get(`/crm/contract/getDetailByContractNo/${data}` )
// 合同回款列表
const incomeList = (data) => fetch.get('/crm/contract/income/list', { params: data } )
// 获取所有的合同编号
const listMasterDeptContract = () => fetch.get('/crm/contract/listMasterDeptSignContract')
// 删除回款列表
const incomeDelete = (data) => fetch.delete(`/crm/contract/income/${data}`)


// 详情回款信息数据
const getIncomeDetail = (data) => fetch.delete(`/crm/contract/getIncomeDetail/${data}`)
// 合同回款详情
const income = (data) => fetch.get(`/crm/contract/income/${data}`)
// 删除回款单条数据
const incomeDetail = (data) => fetch.delete(`/crm/contract/incomeDetail/${data}`)
// 导出
const incomeExport = (data) => fetch.post('/crm/contract/income/export', data)
// 回款信息列表
const listAdd = (data) => fetch.get('/crm/contract/income/listAdd', { params: data })
// 修改合同回款
const incomeEdit = (data) => fetch.put('/crm/contract/income/edit', data )
// 付款批次
const listBatchAmount = (data) => fetch.get(`/crm/contract/listBatchAmount/${data}`)

export {
    incomeAdd,
    getContractByCustomerId,
    contractByCustomerId,
    getDetailByContractNo,
    incomeList,
    incomeDetail,
    listMasterDeptContract,
    incomeDelete,
    getIncomeDetail,
    income,
    incomeExport,
    listAdd,
    incomeEdit,
    listBatchAmount
}