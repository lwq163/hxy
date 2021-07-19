import fetch from '../../request'

// 新增客户
const postAddCustomer = (data) => fetch.post('/crm/customer/add', data)
// 查询客户信息列表
const getCustomerList = (data) => fetch.get('/crm/customer/list', { params:data })
// 获取客户档案信息
const postCustomer = (data) => fetch.get(`/crm/customer/${data}`, )
// 保存客户档案
const postEditCustomer = (data) => fetch.put('/crm/customer/edit', data)
// 关联客户
const associate = (data) => fetch.post('/crm/customer/associate', data)
// 添加客户标签
const tagAdd = (data) => fetch.post('/crm/customer/tag/add', data)
// 客户转移
const transfer = (data) => fetch.post('/crm/customer/transfer', data)
// 客户作废
const changeStatus = (data) => fetch.post('/crm/customer/changeStatus', data)
// 通过社会信用代码获取公司信息
const getCustomerByCreditCode = (data) => fetch.get(`/crm/customer/getCustomerByCreditCode/${data}`, )
// 查询标签列表
const tagList = (data) => fetch.get('/crm/customer/tag/list', { params:data })
// 查询关联客户列表
const associateList = (data) => fetch.get('/crm/customer/associate/list', { params:data })
// 认领客户
const customerCharge = (data) => fetch.post('/crm/customer/charge', data)
// 客户名称
const getMasterDeptCustomer = () => fetch.get('/crm/customer/masterDeptCustomer')
// 删除联系人信息
const contact = (data) => fetch.delete(`/crm/customer/contact/${data}`, )
// 查询客户联系人列表
const contactList = (data) => fetch.get('/crm/customer/contact/list', { params: data })
// 获取联系人详情
const listContactDetail = (data) => fetch.get(`/crm/customer/listContactDetail/${data}`)

// 客情维护获取联系人
const maintainContactList = () => fetch.get('/crm/customer/contact/listMaster')
// 客情维护通过联系人获取详情信息
const maintainContact = () => fetch.get(`/crm/customer/contact/${data}`)
// 获取客户联系人详情(特殊日期)
const maintainContactDetail = (data) => fetch.get(`/crm/customer/contact/${data}`, )
// 保存客情维护
const crmCustomerRelationshipWish = (data) => fetch.post('/crm/crmCustomerRelationshipWish/save', data)


// 根据客户Id获取联系人列表
const listContact = (data) => fetch.get(`/crm/customer/listContact/${data}`)
// 客服模块用来获取客户档案展示表格
const customerDocument = (data) => fetch.get(`/crm/customer/document/${data}`)

// 报件里面获取技术联系人
const getTechsByCustomerId = (data) => fetch.get(`/crm/generateWorkOrder/getTechsByContractNo/${data}`)


// 新增客户股东信息
const addShareholder = (data) => fetch.post('/crm/shareholder/add', data )
const dataType = (data) => fetch.get(`/crm/dict/data/type/${data}`)
// 修改客户状态
const customerChangeStatus = (data) => fetch.post('/crm/customer/changeStatus', data)
// 查询当前登录企业下所有人员
const queryCurrStaff = () => fetch.get('/system/user/queryCurrStaff')
// 当前登录企业下除自己以外的所有人员
const listTransPerson = () => fetch.get('/system/user/listTransPerson')

// 补充信息详情
// const extra = (data) => fetch.get(`/crm/customer/extra/${data}`)
// 补充信息
const extra = (data) => fetch.post('/crm/customer/extra')
// 删除标签（物理）
const tagRemove = (data) => fetch.delete(`/crm/customer/tag/${data}`)
// 修改客户
const tagEdit = (data) => fetch.put('/crm/customer/tag/edit', data)
// 删除客户
const customerRemove = (data) => fetch.delete(`/crm/customer/${data}`)
// 客户导出
const customerExport = (data) => fetch.delete('/crm/customer/export', data)
// 新增客户联系人
const contactAdd = (data) => fetch.post('/crm/customer/contact/add', data)

// 获取客户详细信息
// const contact = (data) => fetch.get(`/crm/customer/${data}`)


export {
    postAddCustomer,
    postCustomer,
    postEditCustomer,
    getCustomerList,
    addShareholder,
    dataType,
    customerChangeStatus,
    associate,
    getMasterDeptCustomer,
    transfer,
    queryCurrStaff,
    listTransPerson,
    extra,
    tagAdd,
    tagList,
    associateList,
    tagRemove,
    tagEdit,
    customerRemove,
    customerExport,
    contactAdd,
    contactList,
    maintainContactList,
    maintainContact,
    contact,
    customerCharge,
    changeStatus,
    getCustomerByCreditCode,
    listContact,
    maintainContactDetail,
    listContactDetail,
    crmCustomerRelationshipWish,
    customerDocument,
    getTechsByCustomerId
}