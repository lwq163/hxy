import fetch from '../../request'

// 用户预注册-查询
const getUserPreList = (data) => fetch.get('/system/userPre/search', { params:data })

// 修改密码
const postAddUserPre = (data) => fetch.post('/system/userPre/add', data)

// 批量通过
const postBatchPass = (data) => fetch.post('/system/userPre/batchPass', data)

// 批量拒绝
const postBatchRefuse = (data) => fetch.post('/system/userPre/batchRefuse', data)

// 校验邮箱
const getUserPreValidateE = (data) => fetch.get('/system/userPre/validateE/' + data)

// 校验手机号码
const getUserPreValidateP = (data) => fetch.get('/system/userPre/validateP/' + data)

// 校验用户名称
const getUserPreValidateU = (data) => fetch.get('/system/userPre/validateU/' + data)

// 正式用户-查询
const getUserList = (data) => fetch.get('/system/user/formal', { params:data })

// 正式用户-冻结/解冻
const postFormalDisable = (data) => fetch.post('/system/user/formal/disable', data)

// 正式用户-限制登录
const postFormalLimit = (data) => fetch.post('/system/user/formal/limit', data)

// 正式用户-删除
const getDeleteUser = (data) => fetch.get('/system/user/formal/delete/' + data)

// 正式用户-编辑查询
const getUserDetail = (data) => fetch.get('/system/user/formal/' + data)

// 正式用户-编辑保存
const postSaveUser = (data) => fetch.post('/system/user/formal/save', data)

// 获取单独角色列表
const getRolesList = (data) => fetch.get('/system/role/single/list', { params:data })

// 新增角色
const postAddRoles = (data) => fetch.post('/system/role/single/add', data)

// 编辑角色
const postEditRoles = (data) => fetch.post('/system/role/single/update', data)

// 角色详情
const getRoleSingleInfo = (data) => fetch.get('/system/role/single-info/' + data)

// 删除角色
const deleteRole = (data) => fetch.delete('/system/role/' + data)

// 获取角色数据范围管理列表
const getRoleDataRangeList = (data) => fetch.get('/system/role/getRoleDataRangeList', { params:data })

// 获取当前企业的区域 部门 基础数据 业务单据 报表清单所有的
const getAreaDeptBaseDataBuinessReport = (data) => fetch.get('/system/role/getAreaDeptBaseDataBuinessReport', { params:data })

// 根据roleid获取当前数据
const getDataByRoleId = (data) => fetch.get('/system/role/getDataByRoleId', { params:data })

// 获取企业角色列表
const getRoleList = (data) => fetch.get('/system/role/list',{ params:data })

// 查询企业下的员工列表
const getQueryEmployeeList = (data) => fetch.get('/system/employee/query/employeeEnableList',{ params:data })

// 编辑角色数据范围
const postDataRangeRole = (data) => fetch.post('/system/role/isnertDataRangeRole', data)


export {
    getUserPreList,
    postAddUserPre,
    postBatchPass,
    postBatchRefuse,
    getUserPreValidateE,
    getUserPreValidateP,
    getUserPreValidateU,
    getUserList,
    postFormalDisable,
    postFormalLimit,
    getDeleteUser,
    getUserDetail,
    postSaveUser,
    getRolesList,
    postAddRoles,
    postEditRoles,
    getRoleSingleInfo,
    deleteRole,
    getRoleDataRangeList,
    getAreaDeptBaseDataBuinessReport,
    getDataByRoleId,
    getRoleList,
    getQueryEmployeeList,
    postDataRangeRole
}