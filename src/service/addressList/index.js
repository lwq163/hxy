import fetch from '../../request'

// 获取用户所属企业列表
const getMasterDeptList = (data) => fetch.get('/system/dept/getMasterDeptList', { params:data })
// 创建企业
const postCreateDept = (data) => fetch.post('/system/dept/add', data)
// 根据企业号获取企业信息
const getDeptInfo = (data) => fetch.get('/system/dept/getDeptInfo/' + data)
// 加入企业申请
const postAddDept = (data) => fetch.post('/system/user/dept/apply/add', data)
// 退出企业
const getQuitDept = (data) => fetch.get('/system/dept/quitDept', { params:data })
// 用户所有企业部门下的申请列表
const getApplyAllList = () => fetch.get('/system/user/dept/apply/allList')
// 拒绝用户企业申请
const getRefuseUserDeptApply = (data) => fetch.get('/system/user/dept/apply/refuseUserDeptApply',{ params:data })
// 获取部门列表
const getDeptList = (data) => fetch.get('/system/dept/treeselect',{ params:data })
const getDeptListNew = (data) => fetch.get('/system/dept/listByMasterDept',{ params:data })

// 查询职能树
const getPostList = (data) => fetch.get('/system/post/groupTree',{ params:data })
// 获取企业角色列表
const getRoleList = (data) => fetch.get('/system/role/list',{ params:data })
// 查询当前企业部门成员
const getDeptEmpList = (data) => fetch.get('/system/dept/orgStructure/' + data)
// 删除部门
const deleteDept = (data) => fetch.delete('/system/dept/' + data)
// 申请设置
const postPassUserDeptApply = (data) => fetch.post('/system/user/dept/apply/passUserDeptApply', data)
// 获取部门详细信息
const getDeptDetail = (data) => fetch.get('/system/dept/' + data)
// 部门详细信息编辑后保存
const postEditDept = (data) => fetch.post('/system/dept/edit', data)

// 查询组织架构列表
const getOrgList = (data) => fetch.get('/system/dept/query/orgStructure/' + data)
// 查询企业下的员工列表(分页)
const getEmpList = (data) => fetch.get('/system/employee/query/employeeList',{ params:data })
// 根据企业id查询企业下的部门列表
const getQueryDeptList = (data) => fetch.get('/system/dept/query/DeptList/' + data)
// 查询企业下的员工列表
const getEmployeeList = (data) => fetch.get('/system/employee/query/employeeList/' + data)
// 添加员工
const postAddEmployee = (data) => fetch.post('/system/employee/add', data)
// 编辑保存
const postEditEmployee = (data) => fetch.post('/system/employee/edit', data)
// 根据id查询员工详情
const getQueryEmployee = (data) => fetch.get('/system/employee/query/' + data)
// 调整部门
const postChangeDept = (data) => fetch.post('/system/employee/changeDept', data)



// 根据岗位查询人员列表
const getPostStaffList = (data) => fetch.get('/system/post/staffList',{ params:data })
// 岗位批量添加人员
const postStaffAdd = (data) => fetch.post('/system/post/staffAdd', data)
// 通讯录设置-
const postUserDeptChange = (data) => fetch.post('/system/userDept/change', data)

// 根据用户关系id查询直属部门、部门、直属主管
const getDirectInfo = (data) => fetch.get('/system/userDept/directInfo/' + data)

export {
    getMasterDeptList,
    postCreateDept,
    getDeptInfo,
    postAddDept,
    getQuitDept,
    getApplyAllList,
    getRefuseUserDeptApply,
    getDeptList,
    getDeptListNew,
    getPostList,
    getRoleList,
    getDeptEmpList,
    deleteDept,
    postPassUserDeptApply,
    getDeptDetail,
    postEditDept,
    getOrgList,
    getEmpList,
    getQueryDeptList,
    getEmployeeList,
    getPostStaffList,
    postStaffAdd,
    postUserDeptChange,
    postAddEmployee,
    postEditEmployee,
    getQueryEmployee,
    postChangeDept,
    getDirectInfo
}