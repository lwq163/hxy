import fetch from '../../request'

// 查询企业合同模板列表
const getContractList = (data) => fetch.get('/system/dept/contract/list', { params:data })
// 新增企业合同模板
const postAddContract = (data) => fetch.post('/system/dept/contract', data)
// 获取企业合同模板详细信息
const getContractDetail = (data) => fetch.get('/system/dept/contract/' + data)
// 删除企业合同模板
const deleteContract = (data) => fetch.delete('/system/dept/contract/' + data)
// 下载合同模板
const downloadContract = (data) => fetch.get('/system/dept/contract/download/' + data)
// 修改企业合同模板
const postEditContract = (data) => fetch.post('/system/dept/contract/edit', data)
//合同默认模板
const morenContract = (data) => fetch.get('/system/dept/contract/default/',{ params:data })

// 根据企业ID获取详细信息
const getMasterDeptInfo = (data) => fetch.get('/system/company/getMasterDeptInfo/' + data)
// 保存企业基本信息
const postEditCompany = (data) => fetch.post('/system/company/edit', data)

// 企业管理-设置子管理员 查询列表（包含编辑信息）
const getQueryChildAdmin = (data) => fetch.get('/system/role/queryChildAdmin',{ params:data })
// 查询当前用户所选择企业下的所有部门
const getSelectCurrDeptList = () => fetch.get('/system/dept/selectCurrDeptList')
// 查询当前登录企业下所有人员
const getCurrStaff = () => fetch.get('/system/user/queryCurrStaff')
// 查询当前登录用户可以查看哪些菜单
const getRoleMenuList = () => fetch.get('/system/menu/roleMenuList')
// 企业管理-设置子管理员-添加子管理员
const postAddChildAdmin = (data) => fetch.post('/system/role/addChildAdmin', data)
// 企业管理-设置子管理员-编辑子管理员后保存
const postEditChildAdmin = (data) => fetch.post('/system/role/editChildAdmin', data)
// 企业管理-设置子管理员-删除子管理员
const deleteRole = (data) => fetch.delete('/system/role/' + data)
// 查询子管理员详情
const getRoleDetail = (data) => fetch.get('/system/role/edit/' + data)
// 解散企业
const getDissolution = (data) => fetch.get('/system/dept/dissolutionOfTheEnterprise',{ params:data })
// 查询当前登录企业下所有人员
const getQueryCurrStaff = () => fetch.get('/system/user/queryCurrStaff')
// 转让企业创建人身份
const getTransferMasterAdmin = (data) => fetch.get('/system/role/transferMasterAdmin', { params:data })
// 查询crm审批模板配置
const getApprovalTemp = (data) => fetch.get('/system/approvalTemp/list',{ params:data })
// 修改crm审批模板
const postEditApprovalTemp = (data) => fetch.post('/system/approvalTemp/edit', data)
// 查看crm审批模板详情
const getApprovalTempDetail = (data) => fetch.get('/system/approvalTemp/getById', { params:data })

// 获取企业/区域/部门/人员 
const getAllOrgStructure = (data) => fetch.get('/system/dept/query/getAllOrgStructure/' + data)

// 查询区域列表
const postAreaList = (data) => fetch.post('/system/area/search/list', data)
// 新增区域
const postAddArea = (data) => fetch.post('/system/area/add', data)
// 编辑区域
const postEditArea = (data) => fetch.post('/system/area/edit', data)
// 删除区域
const deleteArea = (data) => fetch.delete('/system/area/delete/' + data)
// 根据id查询区域列表
const getAreaByIdList = (data) => fetch.get('/system/area/search/' + data)

export {
    getContractList,
    postAddContract,
    getContractDetail,
    deleteContract,
    downloadContract,
    postEditContract,
    getMasterDeptInfo,
    getQueryChildAdmin,
    getSelectCurrDeptList,
    getCurrStaff,
    getRoleMenuList,
    postAddChildAdmin,
    postEditChildAdmin,
    getRoleDetail,
    deleteRole,
    postEditCompany,
    getDissolution,
    getQueryCurrStaff,
    getTransferMasterAdmin,
    getApprovalTemp,
    postEditApprovalTemp,
    getApprovalTempDetail,
	morenContract,
    postAreaList,
    postAddArea,
    postEditArea,
    deleteArea,
    getAreaByIdList,
    getAllOrgStructure
}