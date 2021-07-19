import fetch from '../../request'


// 新增受理单
const applyBillSave = (data) => fetch.post('/crm/applyBill/save', data)
// 获取受理单分页列表
const applyBillList = (data) => fetch.get('/crm/applyBill/list', { params:data })
// /listContactAndFollow
// 根据客户选择客户联系人和跟单人
const listContactAndFollow = (data) => fetch.get(`/crm/customer/listContactAndFollow/${data}`)
// 查看受理单详情
const applyBillDetails = (data) => fetch.get(`/crm/applyBill/details/${data}`)
// 受理单受理
const applyBillAccept = (data) => fetch.post(`/crm/applyBill/accept/${data}`)
// 受理单转让
const applyBillTransfer = (data) => fetch.post('/crm/applyBill/transfer', data)
// 受理单产品获取
const getOnSell = (data) => fetch.get(`/crm/product/getOnSell/${data}`)
// 作废受理单
const invalid = (data) => fetch.post('/crm/applyBill/invalid', data)
// 获取受理单id
const getApplyListByCustomerId = (data) => fetch.get('/crm/applyBill/getApplyListByCustomerId/', { params: data })


export {
    applyBillSave,
    applyBillList,
    listContactAndFollow,
    applyBillDetails,
    applyBillAccept,
    applyBillTransfer,
    getOnSell,
    invalid,
    getApplyListByCustomerId
}